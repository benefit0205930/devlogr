FROM php:8.3-apache

# 必要な拡張機能とツールをインストール
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Apacheの設定
RUN a2enmod rewrite

# Apache DocumentRootを設定
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Directoryディレクティブを追加
RUN sed -i '/<\/VirtualHost>/i \
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>' /etc/apache2/sites-available/000-default.conf

# 作業ディレクトリを設定
WORKDIR /var/www/html

# アプリケーションファイルをコピー（開発環境ではボリュームマウントで上書きされる）
COPY . .

# パーミッション設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage \
    && chmod -R 755 bootstrap/cache

# Apacheをフォアグラウンドで実行
CMD ["apache2-foreground"]
