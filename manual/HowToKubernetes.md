# プロジェクトへのKubernetes導入

このプロジェクトにKubernetesを導入する手順について記載します。

## 0. Dockerイメージをビルドし、イメージファイルを作成
```bash
docker build -t [repository-name]-backend:latest -f docker/backend/Dockerfile.prod backend/
docker build -t [repository-name]-frontend:latest -f docker/frontend/Dockerfile.prod frontend/
docker save [repository-name]-backend:latest -o [repository-name]-backend.tar
docker save [repository-name]-frontend:latest -o [repository-name]-frontend.tar
```

## 1. containerに登録する場合(Linuxn等)
- kubernetesと同じマシンに登録する場合
  - Namespace
    ```bash
    kubectl apply -f k8s/namespace.yaml
    ```
  - backend
    ```bash
    #containerdにイメージを入れる
    sudo ctr -n k8s.io images import [repository-name]-backend.tar
    sudo ctr -n k8s.io images ls | grep [repository-name]
    kubectl delete pod -n [repository-name] --all
    kubectl apply -f k8s/backend/

    #kubectl port-forward svc/backend 8080:80 -n [repository-name]
    #http://localhost:8080

    kubectl run curl-test \
    -n [repository-name] \
    --rm -it \
    --image=curlimages/curl -- sh

    curl -v http://backend:8080
    ```

  - frontend
    ```bash
    #containerdにイメージを入れる
    sudo ctr -n k8s.io images import [repository-name]-frontend.tar
    sudo ctr -n k8s.io images ls | grep [repository-name]
    kubectl delete pod -n [repository-name] --all
    kubectl apply -f k8s/frontend/

    #kubectl port-forward svc/backend 8080:80 -n [repository-name]
    http://localhost:30080

    kubectl exec -it -n [repository-name] deploy/frontend -- sh
    curl -v http://backend:8080
    http://localhost:/30080
     ```
## 2. Docker Desktopに登録する場合(Windows等)
- kubernetesと同じマシンに登録する場合
  - Namespace
    ```bash
    kubectl apply -f k8s/namespace.yaml
    ```
  - backend
    ```bash
    docker load -i [repository-name]-backend.tar
    docker images | grep [repository-name]-backend
    kubectl delete pod -n [repository-name] --all
    kubectl apply -f k8s/backend/

    kubectl run curl-test \
    -n [repository-name] \
    --rm -it \
    --image=curlimages/curl -- sh

    curl -v http://backend:8080
    ```

  - frontend
    ```bash
    docker load -i [repository-name]-frontend.tar
    docker images | grep [repository-name]-frontend
    kubectl delete pod -n [repository-name] --all
    kubectl apply -f k8s/frontend/

    kubectl exec -it -n [repository-name] deploy/frontend -- sh
    curl -v http://backend:8080
    http://localhost:/30080
    ```

## A.1 Raspberry Pi 4 + UbuntuへのKubernetesインストール
- Ubuntu初期設定
  ```bash
  sudo swapoff -a
  sudo sed -i '/ swap / s/^/#/' /etc/fstab
  ```
- cgroup設定
  ```bash
  sudo nano /boot/firmware/cmdline.txt

  以下を末尾に追加
  cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1

  sudo reboot
  ```
- containerdインストール
  ```bash
  sudo apt update
  sudo apt install -y containerd
  ```
  - 設定生成
    ```bash
    sudo mkdir -p /etc/containerd
    sudo containerd config default | sudo tee /etc/containerd/config.toml
    ```
  - systemd cgroupを有効化
    ```bash
    sudo nano /etc/containerd/config.toml

    SystemdCgroup = true

    sudo systemctl restart conteinerd
    sudo systemctl enable containerd
    ```
- Kubernetedリポジトリ追加
  ```bash
  sudo apt install -y apt-transport-https ca-certificates curl

  curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

  echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
  https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /" \
  | sudo tee /etc/apt/sources.list.d/kubernetes.list

  sudo apt update
  ```
- kubeadm/kubelet/kubectlインストール
  ```bash
  sudo apt install -y kubelet kubeadm kubectl
  sudo apt-mark hold kubelet kubeadm kubectl
  ```
- Kubernetes初期化（シングルノード）
  ```bash
  sudo kubeadm init \
  --pod-network-cidr=10.244.0.0/16

  成功すると最後に kubeconfig設定コマンド が表示されます。

  mkdir -p $HOME/.kube
  sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

  kubectl get nodes
  ```
- Podネットワーク（Flannel）導入
  ```bash
  kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml

  kubectl get pods -A
  ```
- シングルノードでPodを動かせるようにする
  ```bash
  kubectl taint nodes --all node-role.kubernetes.io/control-plane-

  kubectl run nginx --image=nginx
  kubectl get pods

  kubectl delete pod nginx
  ```

- スワップの無効化
  ```bash
  sudo swapoff -a
  swapon --show

  sudo systemctl disable swapfile.swap
  sudo systemctl mask swapfile.swap

  sudo systemctl disable mkswap.service
  sudo systemctl mask mkswap.service

  systemctl status swapfile.swap
  systemctl status mkswap.service
  → masked になっていればOK

  sudo rm -f /swapfile

  sudo nano /etc/fstab
  以下が あれば削除 or コメントアウト：
  /swapfile none swap sw 0 0

  sudo systemctl daemon-reload
  sudo systemctl daemon-reexec

  sudo reboot
  ```
