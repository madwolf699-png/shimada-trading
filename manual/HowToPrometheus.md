# プロジェクトへのPrometheus導入

このプロジェクトにPrometheusを導入する手順について記載します。

## A1. Raspberry Pi 4 + Ubuntu
- 全体構成
Kubernetes (Raspberry Pi 4)
 ├─ prometheus (metrics収集)
 ├─ alertmanager
 ├─ grafana (可視化)
 ├─ node-exporter (ノード監視)
 └─ kube-state-metrics (Pod / Service 監視)

- 前提条件
  - Raspberry Pi 4 + Ubuntu
  - Kubernetesクラスタ稼働
  - Pod/Serviceを2つデプロイ済
  - kubectlが使える
- 必要なもの
  - Helm v3
  - ARM64対応（kube-prometheusstackは対応済）

- Helmのインストール
  ```bash
  curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  ```

- Prometheus/Grafana用Namespace作成
  ```bash
  kubectl create namespace monitoring
  ```

- Helmリポジトリ追加
  ```bash
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo update
  ```

- kube-prometheus-stackをインストール
  ```bash
  helm install monitoring prometheus-community/kube-prometheus-stack \
    -n monitoring
  ```

- Pod起動確認
  ```bash
  kubectl get pods -n monitoring
  ```

- Grafanaへアクセスする（NodePort）
  - Grafana Serviceを確認
    ```bash
    kubectl get svc -n monitoring
    ```
  - NodePortに変更（外部アクセス用）
    ```bash
    kubectl edit svc monitoring-grafana -n monitoring

    spec:
      type: NodePort
    ```
  - ブラウザでアクセス
    ```bash
    http://<RaspberryPiのIP>:32000
    ```

-  Grafanaログイン情報
  - 管理者パスワード取得
    ```bash
    kubectl get secret monitoring-grafana -n monitoring \
    -o jsonpath="{.data.admin-password}" | base64 -d
    ```

- すでにダッシュボードは自動で入っている
  - Kubernets Cluster Overview
  - Node CPU/Memory/Disk
  - Pod/Namespace使用量
  - Service/Deployment状態

- 自分のPod/Serviceを監視する
  - Serviceにannotationsを追加
    ```bash
    metadata:
    annotations:
      prometheus.io/scrape: "true"
      prometheus.io/port: "8080"
    ```

- Prometheusでメトリクス確認
  ```bash
  kubectl port-forward svc/monitoring-kube-prometheus-stack-prometheus \
    -n monitoring 9090:9090

  http://localhost:9090
  ```
- Raspberry Pi 4 特有の注意点
  - メモリ対策
    - Pi 4（$GB以下）の場合
      ```bash
      kubectl edit deployment monitoring-kube-prometheus-stack-grafana -n monitoring

      resources:
        limits:
          memory: "512Mi"
        requests:
          memory: "256Mi"
      ```

- 削除したい場合
  ```bash
  helm uninstall monitoring -n monitoring
  kubectl delete namespace monitoring
  ```

- Raspberry Pi 4向け
  - 一度削除
    ```bash
    helm uninstall monitoring -n monitoring
    kubectl delete namespace monitoring
    ```
  - 軽量values.yamlを作成
    ```bash
    grafana:
      replicas: 1
      resources:
        requests:
          cpu: 100m
          memory: 200Mi
        limits:
          memory: 300Mi

    prometheus:
      prometheusSpec:
        replicas: 1
        resources:
          requests:
            cpu: 200m
            memory: 500Mi
          limits:
            memory: 800Mi
        retention: 6h

    alertmanager:
      enabled: false

    kubeStateMetrics:
      resources:
        requests:
          memory: 100Mi
        limits:
          memory: 200Mi

    nodeExporter:
      resources:
        requests:
          memory: 50Mi
        limits:
          memory: 100Mi
    ```

  - 軽量構成で再インストール
    ```bash
    kubectl create namespace monitoring

    helm install monitoring prometheus-community/kube-prometheus-stack \
    -n monitoring \
    -f monitoring/prometheus-values.yaml
    ```

## A2. Windows 11 + Docker Desktop
- 前提条件
  - 必要なもの
    - Windows 11
    - Docker Desktop（最新版推奨）
      - WSL2 backend 有効
      - Docker Desktop が起動していること
  ```bash
  docker --version
  docker compose version
  ```
- 構成概要
  ```bash
  monitoring/
  ├─ docker-compose.yml
  └─ prometheus/
     └─ prometheus.yml
  ```
  - Prometheus : http://localhost:9090
  - Grafana : http://localhost:3000
- 作業ディレクトリ作成
  ```bash
  mkdir monitoring
  cd monitoring
  mkdir prometheus
  ```
- Prometheus設定ファイル作成

  monitoring/prometheus/prometheus.yml
  ```bash
  global:
    scrape_interval: 15s
    evaluation_interval: 15s

  scrape_configs:
    - job_name: "prometheus"
      static_configs:
        - targets: ["localhost:9090"]
  ```
- docker-compose.yml 作成

  monitoring/docker-compose.yml
  ```bash
  version: "3.9"

  services:
    prometheus:
      image: prom/prometheus:latest
      container_name: prometheus
      volumes:
        - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      ports:
        - "9090:9090"
      restart: unless-stopped

    grafana:
      image: grafana/grafana:latest
      container_name: grafana
      ports:
        - "3000:3000"
      restart: unless-stopped
  ```
- コンテナ起動
  ```bash
  cd monitoring
  docker compose up -d
  docker ps
  ```
- Prometheus動作確認
  ```bash
  http://localhost:9090
  ```
- Grafana動作確認
  ```bash
  http://localhost:3000
  ```
  - 初期ログイン
    - ユーザー名：admin
    - パスワード：admin
    - 初回ログイン時に変更要求あり
- Grafana に Prometheus をデータソースとして追加
  - 手順
    - Configuration
    - Data sources
    - Add data source
    - Prometheus
- ダッシュボード作成（簡単確認）

  Explore でテスト
    - 左メニュー → Explore
    - Metric：
      - up
    - Execute
      - → up{job="prometheus"} = 1 が出ればOK
- 削除する場合
  ```bash
  docker compose down --rmi all -v
  ```

## A3. Windows 11 + Docker Desktop
- Helmをインストール
  ```bash
  winget install Helm.Helm
  helm version
  ```
- Helm repo追加
  ```bash
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo update
  ```
-monitoring namespace作成
  ```bash
  kubectl create namespace monitoring
  ```
- kube-prometheus-stack インストール
  ```bash
  helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring
  ```
- 起動確認
  ```bash
  kubectl get pods -n monitoring

  prometheus-monitoring-kube-prometheus-prometheus-0   Running
  alertmanager-monitoring-kube-prometheus-alertmanager-0 Running
  monitoring-grafana-xxxxx                              Running
  ```
- Grafanaへアクセス
  ```bash
  kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80

  http://localhost:3000
  ```
- ログイン情報
  ```bash
  kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode

  以下はPoweShellで
  $pwd = kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}"
  [System.Text.Encoding]::UTF8.GetString(
    [System.Convert]::FromBase64String($pwd)
  )
  ```

  ※adminのパスワードが表示される。

- values.yaml を使って再インストール
  ```bash
  kubelet:
    serviceMonitor:
      https: true
      insecureSkipVerify: true
  ```
- 再インストール
  ```bash
  helm upgrade --install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace -f values.yaml
  ```

- Prometheus Targetsを確認
  ```bash
  kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring

  http://localhost:9090/targets
  ```

## B. 主な Pod 単位メトリクス
| 内容 | メトリクス名 |
|------|--------------|
| CPU使用率 | container_cpu_usage_seconds_total |
| メモリ使用量 | container_memory_usage_bytes |
| 再起動回数 | kube_pod_container_status_restarts_total |
| 状態 | kube_pod_status_phase |
