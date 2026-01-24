# VSCodeの導入

このプロジェクトにVSCodeを導入する手順について記載します。

## A.1 Raspberry Pi 4 + UbuntuへのVSCodeインストール
- 必要パッケージ
  ```bash
  sudo apt update
  sudo apt install -y get gpg
  ```
- Microsoft GPGキー追加
  ```bash
  wget -qO- https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor > microsoft.gpg

  sudo install -o root -g root -m 644 microsoft.gpg /usr/share/keyrings/
  ```
- VS Codeリポジトリ追加
  ```bash
  echo "deb [arch=arm64 signed-by=/usr/share/keyrings/microsoft.gpg] \
  https://packages.microsoft.com/repos/code stable main" \
  | sudo tee /etc/apt/sources.list.d/vscode.list
  ```
- インストール
  ```bash
  sudo apt update
  sudo apt install -y code

  code -version
  ```

