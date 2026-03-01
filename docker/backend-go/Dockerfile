# --- Stage 1: Build ---
# Goのビルド用イメージを指定
FROM golang:1.25-alpine
#FROM golang:1.25-bookworm
#FROM golang:1.25-alpine AS builder

# devcontainerでの開発に最低限必要なパッケージ
RUN apk add --no-cache bash curl git gcc musl-dev tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    echo "Asia/Tokyo" > /etc/timezone

# 作業ディレクトリの作成
WORKDIR /backend-go

# 依存関係（go.mod, go.sum）を先にコピーしてダウンロード
# これにより、ソースコード変更時にライブラリの再ダウンロードを防げる（キャッシュの活用）
#COPY go.mod go.sum* ./
COPY go.mod ./
COPY go.sum* ./
RUN ls -la && go mod download
#RUN go mod download

# ソースコードをコピー
COPY . .

# 3. ここでライブラリをダウンロード！
# まだ go.mod に記載がない場合は、ここで go get することも可能です
RUN go get github.com/go-sql-driver/mysql && go mod tidy

# 開発時はプロセスを落とさないようにする
CMD ["sleep", "infinity"]
CMD ["go", "run", "./app/main.go"]
