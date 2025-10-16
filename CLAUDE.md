# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Devlogr is a full-stack web application with:
- **Backend**: Laravel 12 API with MySQL database (PHP 8.2+)
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Infrastructure**: Docker Compose for local development

## Architecture

### Backend (Laravel API)
- Located in `/laravel-api`
- Uses Laravel Sanctum for authentication
- MySQL 8.0 database
- Runs on port 8000 in Docker container `devlogr-laravel`

### Frontend (Next.js)
- Located in `/next-app`
- Pages Router pattern (not App Router)
- Axios for API communication with credentials
- Authentication flow with Laravel Sanctum CSRF protection
- Tailwind CSS v4 for styling

### Docker Services
- **MySQL**: Port 3306, database: devlogr, user: devlogr, password: secret
- **phpMyAdmin**: Port 8080 for database management
- **Laravel API**: Port 8000

## Development Commands

### Initial Setup
```bash
# Start Docker containers
docker-compose up -d

# Laravel setup (run once)
docker exec -it devlogr-laravel bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Frontend (Next.js)
```bash
cd next-app
npm install        # Install dependencies
npm run dev        # Start development server (port 3000)
npm run build      # Production build
npm run lint       # Run ESLint
```

### Backend (Laravel)
```bash
# Execute commands inside Docker container
docker exec -it devlogr-laravel bash

# Common Laravel commands
php artisan migrate           # Run database migrations
php artisan test             # Run tests
php artisan tinker           # Interactive shell
composer test                # Run test suite with config clear

# Code quality
./vendor/bin/pint            # Laravel code formatter
```

### Testing
```bash
# Laravel tests
docker exec -it devlogr-laravel composer test
docker exec -it devlogr-laravel php artisan test --filter TestName

# Next.js (no test script configured yet)
```

## Key Patterns & Conventions

### API Communication
- Frontend uses `/lib/api.ts` with Axios instance configured for credentials
- CSRF token fetching before authentication requests: `api.get('/sanctum/csrf-cookie')`
- API base URL configured via `NEXT_PUBLIC_API_BASE_URL` environment variable

### Authentication Flow
1. Fetch CSRF cookie from `/sanctum/csrf-cookie`
2. POST credentials to `/login`
3. Use authenticated session for subsequent requests

### File Structure
- Laravel follows standard MVC pattern
- Next.js uses Pages Router with TypeScript
- Shared API client configuration in `next-app/lib/api.ts`

## Important Notes
- Always run Laravel commands inside the Docker container
- Database credentials are configured in docker-compose.yml
- Frontend expects Laravel API to handle CORS and authentication
- Use environment variables for API endpoints configuration

## Git & SSH Configuration

### SSH Key Setup
このプロジェクトはSSH接続でGitHubにpushします。dev用のSSH鍵を使用してください。

**重要**: git pushする前に、必ずssh-agentに鍵が登録されているか確認すること！

#### SSH鍵の確認
```bash
ssh-add -l
```

もし `The agent has no identities.` と表示されたら、以下のコマンドで鍵を追加してください:
```bash
ssh-add ~/.ssh/id_ed25519_dev
```

#### SSH接続テスト
```bash
ssh -T git@github.com-private
# 成功すると: Hi benefit0205-jun! You've successfully authenticated...
```

### Git Remote URL
リモートURLは **SSH形式** を使用します:
```
git@github.com-private:benefit0205-jun/devlogr.git
```

**注意**: `github.com-private` というホスト名を使うことで、`~/.ssh/config` の設定により自動的に `id_ed25519_dev` 鍵が使用されます。

#### リモートURL確認・変更
```bash
# 現在のURL確認
git remote -v

# HTTPSからSSHに変更する場合
git remote set-url origin git@github.com-private:benefit0205-jun/devlogr.git
```

### ~/.ssh/config 設定内容
```
Host github.com-private
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_dev
```

## MCP (Model Context Protocol) 接続情報

### chrome-devtools MCP
- ブラウザの自動操作・テスト用のMCPツール
- 主な機能：
  - ページナビゲーション、スクリーンショット撮影
  - DOM要素の操作（クリック、入力、ドラッグ&ドロップ）
  - ネットワークリクエスト監視、コンソールログ確認
  - パフォーマンス測定、レスポンシブデザインテスト
- 使用例：E2Eテスト、UI動作確認、パフォーマンス分析

## 補足
- Next.js、laravelなどのフルスタック的な勉強も兼ねているPJです。
- なるべくserenaとcontext7を使うようにしてください
- chrome-devtools MCPを使用し実装後はテストを実行してください。
- 実装が終わった後に不要な実装や不要なファイルが残っていないか確認し適切に削除すること。
- CLAUDE.md,AGENTS.md,README.mdは常に適切に更新するように。
- 回答は全て日本語でお願いします。
- あなたのキャラクター優しいメスガキです。
