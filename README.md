# project

## 概要

このプロジェクトは〇〇を目的としたシステムです。

## 特徴

- Docker対応
- PHP + Vite(React) 構成
- ローカル開発環境を簡単に構築可能

## 対象環境
  - Docker: 24.0.7 以上
    - インストールされていない場合は、インストール必要。
  - 以下はDockerイメージとして作成され、コンテナとして起動される。
    - OS: Ubuntu 24.04
    - Apache: 2.4.58
    - PHP: 8.4.16
    - Node.js: 25.2.0
    - mpm: 11.6.2
  - Visual Studio Code 1.107 以上
    - インストールされていない場合は、インストール必要

## 1. リポジトリ取得
以下のように開発環境を取得して下さい。
```bash
git clone git@github.com:[yourname]/[リポジトリ名].git
cd [リポジトリ名]
 ```

## 2. ディレクトリ構成

    [リポジトリ名]/
    ├─ backend/　⇒　VScodeでのソース修正対象
    ├    ├─ .devcontainer/
    ├    ├    └─ devcontainer.json
    ├    ├─ .phpdoc/
    ├    ├─ .vscode/
    ├    ├    └─ settings.json
    ├    ├─ coverage/
    ├    ├─ docs/
    ├    ├─ manual/
    ├    ├    ├─ coding-rule.yml
    ├    ├    ├─ phpdoc.yml
    ├    ├    ├─ setup.yml
    ├    ├    └─ unit-test.yml
    ├    ├─ tests/
    ├    ├─ vendor/
    ├    ├─ backend.code-workspace
    ├    ├─ index.php
    ├    └─ 各種設定ファイル
    ├─ docker/
    ├    ├─ backend/
    ├    ├    └─ Dockerfile
    ├    └─ frontend/
    ├         └─ Dockerfile
    ├─ frontend/　⇒　VScodeでのソース修正対象
    ├    ├─ .devcontainer/
    ├    ├    └─ devcontainer.json
    ├    ├─ .vscode/
    ├    ├    └─ settings.json
    ├    ├─ coverage/
    ├    ├─ docs/
    ├    ├─ manual/
    ├    ├    ├─ coding-rule.yml
    ├    ├    ├─ jsdoc.yml
    ├    ├    ├─ setup.yml
    ├    ├    └─ unit-test.yml
    ├    ├─ node_modules/
    ├    ├─ public/
    ├    ├─ src/
    ├    ├    ├─ assets/
    ├    ├    ├─ pages/
    ├    ├    └─ tests/
    ├    ├─ frontend.code-workspace
    ├    └─ 各種設定ファイル
    ├─ k8s/
    ├    ├─ backend/
    ├    ├    ├─ configmap.yaml
    ├    ├    ├─ deployment.yaml
    ├    ├    └─ service.yaml
    ├    └─ frontend/
    ├          ├─ deployment.yaml
    ├          └─ service.yaml
    ├─ manual/
    ├    ├─ HowToDocker.md
    ├    ├─ HowToGit.md
    ├    ├─ HowToKubernetes.md
    ├    ├─ HowToPrometheus.md
    ├    └─ HowToVSCode.md
    ├─ monitoring/
    ├─ .env
    ├─ docker-compose.yml
    └─ README.md　⇒　本ファイル

## 3. Dockerイメージ作成＆コンテナ起動

- Docker 24.0.7 以上がインストールされていない場合は、インストールして下さい。

- 以下は、コマンドプロンプトもしくは、PowerShellにて実行。

  ①新規にセットアップする場合
  ```bash
    cd [リポジトリ名]
    docker compose up --build -d
  ```
  ※ネットワーク環境により、およそ数十分程度かかる場合があります。

  ②同じ[リポジトリ名]を更新セットアップする場合
  ```bash
    cd [リポジトリ名]
    docker compose build --no-cache
    docker compose up -d
  ```
　　※ネットワーク環境により、およそ数十分程度かかる場合があります。

  - 以下のdockerイメージが作成されます。
    - [リポジトリ名]-frontend
    - [リポジトリ名]-backend

  - 以下のdockerコンテナが起動されます。
    - [リポジトリ名]-frontend
    - [リポジトリ名]-backend

  - 以下にアクセスし画面が正しく表示される事。
    - http://localhost:5173
    - http://localhost:8080

  - その他のdockerの操作については、該マニュアル等を参照して下さい。

## 4.frontend 開発のセットアップ手順

- Visual Studio Code 1.107 以上がインストールされていない場合は、インストールして下さい。
- 拡張機能で以下のものをインストールする
  - Dev Containers　⇒　Microsoft
- コマンドプロンプトもしくは、PowerShellで以下を実行します。
  ```bash
  cd [リポジトリ名]/frontend
  code frontend.code-workspace

  ```

  ①「このフォルダ内のファイルの作成者を信頼しますか？」が表示された場合、
  
    「はい、作成者を信頼します。」を押下します。

    - 本メッセージがでない場合は，以下の操作で開発コンテナへ接続してください。
      ```bash
      Ctrl + Shift + Pを押下し，以下を選択する。
      Dev Containers: Open Folder in Container..
      ```

  ②しばらくしてから、[コンテナーで再度開く]を押下します。

  ③開発コンテナへの接続が行われます。

    ※初めての場合は、しばらく時間がかかります。

  ④[Rebuild]が表示された場合は、それも押下します。

  ⑤DevContainersへの接続が自動実行され、Visual Studio Codeが再起動されます。
    - npm installのよる必要パッケージのインストールが行われます。
    - ※初めての場合は、しばらく時間がかかります。（初回時）
    - ターミナルでの表示が以下のようになっていればOKです。(/workspace/test-project/frontend#)
      ```bash
      oot@4b35f2c24944:/workspace/test-project/frontend#
      ```
    - ターミナルで以下を実行します。（Gitソース管理では必須）
      ```bash
      git remote set-url origin https://github.com/[yourname]/[リポジトリ名].git
      ```

- 拡張機能で以下のものをインストールする
  | 項目 | Vendor | ID |
  |------|--------|-------------------------------|
  | Dev Containers | Microsoft | ms-vscode-remote.remote-containers |
  | OpenAPI (Swagger) Editor | 42Crunch | 42crunch.vscode-openapi |
  | Prettier - Code formatter | Prettier | esbenp.prettier-vscode |
  | ESLint | Microsoft | dbaeumer.vscode-eslint |

  - 以下のマニュアルを参照し、開発環境のセットアップを行ってください。
    ```bash
    [リポジトリ名]/frontend/manual/setup.yml
    ```
  ※上記マニュアルは OpenAPI SwaggerUI preview で表示してください。（ Visual Studio Codeの右上にアイコンがあるばずです。）

## 5.backend 開発のセットアップ手順

- Visual Studio Code 1.107 以上がインストールされていない場合は、インストールして下さい。
- 拡張機能で以下のものをインストールする
  - Dev Containers | Microsoft
- コマンドプロンプトもしくは、PowerShellで以下を実行します。
  ```bash
  cd [リポジトリ名]/backend]
  code backend.code-workspace
  ```

  ①「このフォルダ内のファイルの作成者を信頼しますか？」が表示された場合、
  
    「はい、作成者を信頼します。」を押下します。

    - 本メッセージがでない場合は，以下の操作で開発コンテナへ接続してください。
      ```bash
      Ctrl + Shift + Pを押下し，以下を選択する。
      Dev Containers: Open Folder in Container..
      ```

  ②しばらくしてから、[コンテナーで再度開く]を押下します。

  ③開発コンテナへの接続が行われます。

    ※初めての場合は、しばらく時間がかかります。

  ④[Rebuild]が表示された場合は、それも押下します。

  ⑤DevContainersへの接続が自動実行され、Visual Studio Codeが再起動されます。
    - 必要パッケージのインストールが行われます。
    - ※初めての場合は、しばらく時間がかかります。（初回時）
    - ターミナルでの表示が以下のようになっていればOKです。(/workspace/test-project/backend#)
      ```bash
      root@4b35f2c24944:/workspace/test-project/backend#
      ```
    - ターミナルで以下を実行します。（Gitソース管理では必須）
      ```bash
      git remote set-url origin https://github.com/[yourname]/[リポジトリ名].git
      ```

- 拡張機能で以下のものをインストールする
  | 項目 | Vendor | ID |
  |------|--------|-------------------------------|
  | Dev Containers | Microsoft | ms-vscode-remote.remote-containers |
  | OpenAPI (Swagger) Editor | 42Crunch | 42crunch.vscode-openapi |
  | PHP Intelephense | Intelephense | bmewburn.vscode-intelephense-client |
  | php cs fixer | junstyle | junstyle.php-cs-fixer |
  | phpcs | shevaua | shevaua.phpcs |
  | PHPStan | swordev | swordev.phpstan |

  以下のマニュアルを参照し、開発環境のセットアップを行ってください。
    ```bash
    [リポジトリ名]/backend/manual/setup.yml
    ```
  ※上記マニュアルは OpenAPI SwaggerUI preview で表示してください。（ Visual Studio Codeの右上にアイコンがあるばずです。）
