FROM ubuntu:24.04

# タイムゾーンを日本時間に設定
ENV TZ=Asia/Tokyo

ENV DEBIAN_FRONTEND=noninteractive

#IPv6を強制的に無効化
RUN echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4

# 日本ミラーへ完全切替（sources.list + sources.list.d）
RUN sed -i 's|http://archive.ubuntu.com|http://jp.archive.ubuntu.com|g' /etc/apt/sources.list

# 必要パッケージ + PHP 最新版（Ondřej Surý PPA）
RUN apt-get update -o Acquire::ForceIPv4=true && apt-get install -y \
    software-properties-common \
    ca-certificates \
    curl \
    unzip \
    git \
    apache2 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Ondřej PHP PPA 追加
RUN add-apt-repository ppa:ondrej/php -y

# PPA 追加後に再度ミラー置換（ここが超重要）
RUN if ls /etc/apt/sources.list.d/*.list >/dev/null 2>&1; then \
      sed -i 's|http://archive.ubuntu.com|http://jp.archive.ubuntu.com|g' \
      /etc/apt/sources.list.d/*.list ; \
    fi

# PHP 8.4 環境
RUN apt-get update -o Acquire::ForceIPv4=true && apt-get install -y --fix-missing \
    php8.4 \
    php8.4-cli \
    php8.4-dev \
    php8.4-mbstring \
    php8.4-xml \
    php8.4-curl \
    php8.4-zip \
    libapache2-mod-php8.4 \
    php-pear \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# PHP バージョン固定
RUN update-alternatives --set php /usr/bin/php8.4 && \
    update-alternatives --set phpize /usr/bin/phpize8.4 && \
    update-alternatives --set php-config /usr/bin/php-config8.4

# Xdebug (PECL)
RUN pecl install xdebug && \
    echo "zend_extension=xdebug.so" > /etc/php/8.4/mods-available/xdebug.ini && \
    phpenmod xdebug

# Xdebug coverage 設定
RUN echo "xdebug.mode=coverage" > /etc/php/8.4/cli/conf.d/99-xdebug.ini && \
    echo "xdebug.start_with_request=no" >> /etc/php/8.4/cli/conf.d/99-xdebug.ini

# Apache設定
RUN a2enmod rewrite

# Composer インストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# composer.json / composer.lock を先にコピー（Dockerキャッシュ最適化）
COPY ./composer.json ./composer.lock* ./

# 依存関係インストール
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# 残りのソースをコピー
COPY . .

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]
