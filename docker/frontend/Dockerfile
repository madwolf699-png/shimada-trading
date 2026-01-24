FROM ubuntu:24.04

# タイムゾーンを日本時間に設定
ENV TZ=Asia/Tokyo

ENV DEBIAN_FRONTEND=noninteractive

#IPv6を強制的に無効化
RUN echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4

# 日本ミラー使用
RUN sed -i 's|http://archive.ubuntu.com|http://jp.archive.ubuntu.com|g' /etc/apt/sources.list

# Node.js (LTS) インストール
RUN apt-get update && apt-get install -y curl ca-certificates \
    unzip \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_current.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
