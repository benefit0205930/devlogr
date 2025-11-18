#!/bin/bash
set -e

# ログ出力用
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "Starting user-data script at $(date)"

# システム更新
yum update -y

# PHP 8.3 + Apache + 必要な拡張機能のインストール
amazon-linux-extras enable php8.3
yum install -y \
    php \
    php-cli \
    php-common \
    php-mysqlnd \
    php-pdo \
    php-xml \
    php-mbstring \
    php-json \
    php-curl \
    php-zip \
    php-gd \
    httpd \
    git \
    unzip

# Apache起動と自動起動設定
systemctl start httpd
systemctl enable httpd

# Composerインストール
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# Apache DocumentRootを設定
sed -i 's|DocumentRoot "/var/www/html"|DocumentRoot "/var/www/html/laravel-api/public"|g' /etc/httpd/conf/httpd.conf

# Apache設定: AllowOverride All
sed -i '/<Directory "\/var\/www\/html">/,/<\/Directory>/s/AllowOverride None/AllowOverride All/' /etc/httpd/conf/httpd.conf

# アプリケーションディレクトリ作成
mkdir -p /var/www/html
cd /var/www/html

# GitHubからクローン（リポジトリURLが指定されている場合）
if [ -n "$github_repo_url" ]; then
    git clone "$github_repo_url" .
else
    # ローカル開発用: ディレクトリ構造を作成
    mkdir -p laravel-api
    cd laravel-api
fi

# Laravel環境変数設定
cat > .env <<EOF
APP_NAME=Devlogr
APP_ENV=$environment
APP_KEY=$app_key
APP_DEBUG=true
APP_URL=$app_url

DB_CONNECTION=mysql
DB_HOST=$db_host
DB_PORT=3306
DB_DATABASE=$db_name
DB_USERNAME=$db_username
DB_PASSWORD=$db_password

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost

SANCTUM_STATEFUL_DOMAINS=localhost
EOF

# Composer依存関係インストール
if [ -f composer.json ]; then
    composer install --no-dev --optimize-autoloader
fi

# ストレージとキャッシュのパーミッション設定
chown -R apache:apache /var/www/html
chmod -R 755 /var/www/html/laravel-api/storage
chmod -R 755 /var/www/html/laravel-api/bootstrap/cache

# マイグレーション実行（DB接続が確立されるまで待機）
echo "Waiting for database connection..."
sleep 30

# マイグレーション実行
cd /var/www/html/laravel-api
php artisan migrate --force || echo "Migration failed, but continuing..."

# Apache再起動
systemctl restart httpd

echo "User-data script completed at $(date)"

