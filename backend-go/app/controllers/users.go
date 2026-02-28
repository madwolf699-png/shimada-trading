package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql" // MySQLドライバのインポート
	// 必要に応じてDB接続用のパッケージなどをインポート
)

// UsersController 構造体にDBを保持させる
//
// # Database Interaction
// All methods in this controller use the embedded *sql.DB to perform
// CRUD operations on the 'users' table.
// UsersController handles HTTP requests for user management.
// It implements the [ServerInterface] and interacts directly with the database.
type UsersController struct {
	// DB is the active SQL database connection.
	DB *sql.DB
}

// PostUsers creates a new user in the database.
//
// It expects a [UsersRequestPost] JSON body and returns the created [User]
// object with a 201 Created status.
func (c *UsersController) PostUsers(w http.ResponseWriter, r *http.Request) {
	var req UsersRequestPost // 自動生成された型
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return // 本来はValidatorミドルウェアが先に弾くのでここには来ない
	}
	res, _ := c.DB.Exec("INSERT INTO users (name) VALUES (?)", req.Name)
	lastID, _ := res.LastInsertId()
	fmt.Fprintf(w, "User created with ID: %d\n", lastID)
	newID := int(lastID)
	response := UsersResponsePost{
		ID:   newID,
		Name: req.Name, // ポインタ型なら & を付ける
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated) // 201 Created
	json.NewEncoder(w).Encode(response)
}

// 2. GET /users の実装
func (c *UsersController) GetUsers(w http.ResponseWriter, r *http.Request) {
	// DBから取得して UsersResponseGet (自動生成) を返すロジック
	rows, _ := c.DB.Query("SELECT id, name FROM users")
	defer rows.Close()
	var userList []User
	for rows.Next() {
		var id int
		var name string
		rows.Scan(&id, &name)
		// ポインタとして格納
		u := User{
			ID:   id,
			Name: name,
		}
		tempID := id
		tempName := name
		u.ID = tempID
		u.Name = tempName
		userList = append(userList, u)
	}
	// レスポンス全体を組み立て
	response := UsersResponseGet{
		Users: &userList,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// 3. PUT /users の実装
func (c *UsersController) PutUsers(w http.ResponseWriter, r *http.Request) {
	var req UsersRequestPut // 自動生成された型
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return
	}
	c.DB.Exec("UPDATE users SET name = ? WHERE id = ?", req.Name, req.ID)
	fmt.Fprintf(w, "User %d updated\n", req.ID)
	response := UsersResponsePut{
		ID:   req.ID,
		Name: req.Name,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// 4. DELETE /users の実装
func (c *UsersController) DeleteUsers(w http.ResponseWriter, r *http.Request) {
	var req UsersRequestDelete // 自動生成された型
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return
	}
	c.DB.Exec("DELETE FROM users WHERE id = ?", req.ID)
	fmt.Fprintf(w, "User %d deleted\n", req.ID)
	response := UsersResponseDelete{
		ID:   req.ID,
		Name: "",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

/*
type UsersRequest struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
*/

// HandlerUserは外部から呼べるように頭文字を大文字にする
/*
func (c *UsersController) HandleUser(w http.ResponseWriter, r *http.Request) {
	var req UsersRequest

	switch r.Method {
	case "POST": // INSERT
		// ① JSONを受信
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// ② MySQLアクセス
		//name := r.URL.Query().Get("name")
		res, _ := c.DB.Exec("INSERT INTO users (name) VALUES (?)", req.Name)
		id, _ := res.LastInsertId()
		fmt.Fprintf(w, "User created with ID: %d\n", id)

	case "GET": // SELECT
		rows, _ := c.DB.Query("SELECT id, name FROM users")
		var users []UsersRequest
		for rows.Next() {
			var u UsersRequest
			rows.Scan(&u.ID, &u.Name)
			users = append(users, u)
		}
		// 結果をJSONで返す
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)

	case "PUT": // UPDATE
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		//id := r.URL.Query().Get("id")
		//name := r.URL.Query().Get("name")
		c.DB.Exec("UPDATE users SET name = ? WHERE id = ?", req.Name, req.ID)
		fmt.Fprintf(w, "User %s updated\n", req.ID)

	case "DELETE": // DELETE
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		//id := r.URL.Query().Get("id")
		c.DB.Exec("DELETE FROM users WHERE id = ?", req.ID)
		fmt.Fprintf(w, "User %s deleted\n", req.ID)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
*/
