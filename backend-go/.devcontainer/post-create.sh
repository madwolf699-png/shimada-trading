#!/bin/sh
set -e # エラーが発生したら即座に終了

# /app ディレクトリへ移動
cd app

# 依存関係の整理
go mod tidy

# 開発用ツールのインストール
echo "Installing Go tools..."
go install github.com/ramya-rao-a/go-outline@latest
go install golang.org/x/tools/gopls@latest
go install github.com/air-verse/air@latest
go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest
go get github.com/getkin/kin-openapi/openapi3
go get github.com/oapi-codegen/echo-middleware
go install github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest
go install gotest.tools/gotestsum@latest
go install github.com/vakenbolt/go-test-report@latest
go install github.com/cweill/gotests/gotests@latest
go get github.com/DATA-DOG/go-sqlmock

echo "Done!"
