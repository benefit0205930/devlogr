FROM php:8.3-apache

# 必要拡張
RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql

# Composer install
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Apache設定
WORKDIR /var/www/html
COPY . .

# Laravel初期化（あとでbind mountされるのでOK）
RUN chmod -R 755 storage
