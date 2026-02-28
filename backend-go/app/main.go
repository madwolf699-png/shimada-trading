package main

import (
	"backend-go/controllers"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	//middleware "github.com/deepmap/oapi-codegen/pkg/chi-middleware"
	middleware "github.com/deepmap/oapi-codegen/pkg/chi-middleware"
	"github.com/go-chi/chi/v5"
	//middleware "github.com/oapi-codegen/nethttp-middleware"
)

func main() {
	dsn := "root:rootpassword@tcp(db:3306)/app_db"
	db, err := sql.Open("mysql", dsn) // DB接続
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 接続確認（DBコンテナが立ち上がるまで少し待機が必要な場合があります）
	for i := 0; i < 10; i++ {
		err = db.Ping()
		if err == nil {
			break
		}
		fmt.Println("DBに接続中...")
		time.Sleep(2 * time.Second)
	}

	// 1. OpenAPI定義のロード
	swagger, _ := controllers.GetSwagger()
	// 2. ルーター（Chiなど）の設定
	r := chi.NewRouter()
	// 3. ★ここでバリデーションを挟む
	// これにより各メソッド内で「型チェック」を書く必要がなくなります
	r.Use(middleware.OapiRequestValidator(swagger))
	// 4. ハンドラーの登録 (自動生成された関数を使用)
	userCtrl := &controllers.UsersController{DB: db}
	controllers.HandlerFromMux(userCtrl, r)

	http.ListenAndServe(":8080", r)

	// コントローラーをインスタンス化してDBを渡す
	/*
		userCtrl := &controllers.UsersController{DB: db}

		http.HandleFunc("/users", userCtrl.HandleUser)

		fmt.Println("Server starting on :8080...")
	*/
	log.Fatal(http.ListenAndServe(":8080", nil))
}
