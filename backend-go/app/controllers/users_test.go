package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	_ "github.com/go-sql-driver/mysql"
)

// 共通ヘルパー: モックDBとコントローラーを準備する
func setup(t *testing.T) (*UsersController, sqlmock.Sqlmock, func()) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %s", err)
	}

	ctrl := &UsersController{DB: db}

	// 終了処理をクロージャで返す
	teardown := func() {
		db.Close()
	}

	return ctrl, mock, teardown
}

// 共通ヘルパー: JSONボディを持つリクエストを作成する
func newJSONRequest(method, url string, body interface{}) (*http.Request, *httptest.ResponseRecorder) {
	var b bytes.Buffer
	if body != nil {
		json.NewEncoder(&b).Encode(body)
	}
	req := httptest.NewRequest(method, url, &b)
	req.Header.Set("Content-Type", "application/json")
	return req, httptest.NewRecorder()
}

func TestUsersController_PostUsers(t *testing.T) {
	ctrl, mock, teardown := setup(t)
	defer teardown()

	// 1. このテスト固有のDB期待値
	mock.ExpectExec("INSERT INTO users").
		WithArgs("John Doe").
		WillReturnResult(sqlmock.NewResult(1, 1))

	// 2. このテスト固有のリクエスト
	req, w := newJSONRequest("POST", "/users", UsersRequestPost{Name: "John Doe"})

	// 3. 実行
	ctrl.PostUsers(w, req)

	// 4. 検証
	if w.Code != http.StatusCreated {
		t.Errorf("Expected 201, got %d", w.Code)
	}
}

func TestUsersController_GetUsers(t *testing.T) {
	ctrl, mock, teardown := setup(t)
	defer teardown()

	// --- DBの準備 ---
	// SELECTの結果として返したいデータを定義
	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "Alice").
		AddRow(2, "Bob")

	// SQLの期待値: SELECT文が実行されることを期待
	mock.ExpectQuery("SELECT id, name FROM users").
		WillReturnRows(rows)

	// --- HTTPの準備 ---
	// GETなのでボディは nil
	req, w := newJSONRequest("GET", "/users", nil)

	// --- 実行 ---
	ctrl.GetUsers(w, req)

	// --- 検証 ---
	if w.Code != http.StatusOK {
		t.Errorf("Expected 200, got %d", w.Code)
	}

	var resp UsersResponseGet
	json.NewDecoder(w.Body).Decode(&resp)

	// 返ってきたユーザー数の確認
	if len(*resp.Users) != 2 {
		t.Errorf("Expected 2 users, got %d", len(*resp.Users))
	}
}

func TestUsersController_PutUsers(t *testing.T) {
	ctrl, mock, teardown := setup(t)
	defer teardown()

	targetID := 1
	newName := "Updated Name"

	// --- DBの準備 ---
	// UPDATE文が正しい引数で実行されることを期待
	mock.ExpectExec("UPDATE users SET name = \\? WHERE id = \\?").
		WithArgs(newName, targetID).
		WillReturnResult(sqlmock.NewResult(0, 1)) // RowsAffected=1

	// --- HTTPの準備 ---
	req, w := newJSONRequest("PUT", "/users", UsersRequestPut{
		ID:   targetID,
		Name: newName,
	})

	// --- 実行 ---
	ctrl.PutUsers(w, req)

	// --- 検証 ---
	if w.Code != http.StatusOK {
		t.Errorf("Expected 200, got %d", w.Code)
	}

	var resp UsersResponsePut
	json.NewDecoder(w.Body).Decode(&resp)

	if resp.Name != newName {
		t.Errorf("Expected name %s, got %s", newName, resp.Name)
	}
}

func TestUsersController_DeleteUsers(t *testing.T) {
	ctrl, mock, teardown := setup(t)
	defer teardown()

	// 削除用の期待値
	mock.ExpectExec("DELETE FROM users").
		WithArgs(123).
		WillReturnResult(sqlmock.NewResult(0, 1))

	req, w := newJSONRequest("DELETE", "/users", UsersRequestDelete{ID: 123})

	ctrl.DeleteUsers(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected 200, got %d", w.Code)
	}
}
