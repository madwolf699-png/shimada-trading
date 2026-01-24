# Dockerの導入

このプロジェクトにDockerを導入する手順について記載します。

## A.1 Raspberry Pi 4 + UbuntuへのDockerインストール
- 中途半端なDockerを削除
  ```bash
  sudo apt remove -y docker docker-cli docker.io docker-ce docker-ce-cli
  sudo snap remove docker 2>/dev/null || true
  ```
- Docker Engineを入れる
  ```bash
  sudo apt update
  sudo apt install -y docker.io
  ```
- Dockerサービス起動
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl start docker
  sudo systemctl enable docker

  systemctl status docker
  docker version
  docker ps -a
  ```
- Docker Composeのインストール
  ```bash
  sudo apt update
  sudo apt install -y docker-compose-plugin

  docker compose version
  ```

