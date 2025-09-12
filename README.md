## プロジェクトルートにて実行
docker-compose up -d

## next.jsプロジェクト(フロント)
cd next-app

## Laravelの初期化
docker exec -it devlogr-laravel bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

## phpmyadmin
ユーザー名: devlogr
パスワード: secret
