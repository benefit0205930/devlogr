# Terraform Infrastructure as Code

このディレクトリには、DevlogrプロジェクトのAWSインフラストラクチャを定義するTerraform設定が含まれています。

## ディレクトリ構造

```
terraform/
├── modules/              # 再利用可能なモジュール
│   ├── networking/       # VPC、サブネット、セキュリティグループ
│   ├── database/         # RDS MySQL
│   └── compute/          # EC2インスタンス
├── environments/         # 環境別設定
│   └── dev/              # 開発環境
│       ├── main.tf       # メイン設定ファイル
│       ├── variables.tf  # 変数定義
│       ├── outputs.tf    # 出力値定義
│       └── terraform.tfvars.example  # 変数値の例
├── versions.tf           # Terraformとプロバイダーのバージョン指定
├── backend.tf            # バックエンド設定（初期はローカル）
└── README.md             # このファイル
```

## 前提条件

1. **AWSアカウント**: AWSアカウントを持っていること
2. **AWS CLI**: インストール済みで認証情報が設定されていること

   ```bash
   aws configure
   ```

3. **Terraform**: バージョン1.6以上がインストールされていること

   ```bash
   terraform version
   ```

## セットアップ手順

### 1. 変数ファイルの作成

`terraform/environments/dev/terraform.tfvars.example` をコピーして `terraform.tfvars` を作成：

```bash
cd terraform/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

### 2. 変数の設定

`terraform.tfvars` を編集して、以下の値を設定：

- `key_pair_name`: EC2に接続するためのキーペア名（事前にAWSコンソールで作成）
- `db_password`: RDSのマスターパスワード（強力なパスワードを設定）
- `app_key`: Laravelアプリケーションキー（`php artisan key:generate --show`で生成）

**重要**: `terraform.tfvars` は機密情報を含むため、Gitにコミットしないでください。

### 3. EC2キーペアの作成

AWSコンソールまたはAWS CLIでキーペアを作成：

```bash
aws ec2 create-key-pair --key-name devlogr-dev-key --query 'KeyMaterial' --output text > ~/.ssh/devlogr-dev-key.pem
chmod 400 ~/.ssh/devlogr-dev-key.pem
```

### 4. Laravelアプリケーションキーの生成

ローカル環境でLaravelアプリケーションキーを生成：

```bash
cd laravel-api
php artisan key:generate --show
```

出力されたキーを `terraform.tfvars` の `app_key` に設定。

### 5. Terraformの初期化

```bash
cd terraform/environments/dev
terraform init
```

### 6. 実行計画の確認

```bash
terraform plan
```

### 7. インフラの作成

```bash
terraform apply
```

確認プロンプトで `yes` と入力すると、リソースが作成されます。

### 8. 出力値の確認

作成後、以下のコマンドで出力値を確認：

```bash
terraform output
```

## リソースの削除

テスト後、リソースを削除してコストを抑える：

```bash
terraform destroy
```

## モジュールの説明

### Networking Module

- VPC (10.0.0.0/16)
- パブリックサブネット (10.0.1.0/24, 10.0.2.0/24) - 2つのAZ
- プライベートサブネット (10.0.11.0/24, 10.0.12.0/24) - 2つのAZ
- Internet Gateway
- セキュリティグループ（EC2用、RDS用）

### Database Module

- RDS MySQL 8.0
- インスタンスクラス: db.t2.micro（無料枠）
- ストレージ: 20GB (gp2)
- バックアップ: 7日間保持
- プライベートサブネットに配置

### Compute Module

- EC2インスタンス
- インスタンスタイプ: t2.micro（無料枠）
- AMI: Amazon Linux 2023
- User DataスクリプトでLaravel環境を自動構築
- パブリックサブネットに配置

## 注意事項

1. **コスト**: 無料枠を超えるとコストが発生します。テスト後は必ず `terraform destroy` でリソースを削除してください。

2. **セキュリティ**:
   - `terraform.tfvars` はGitにコミットしないでください
   - 本番環境では、より厳格なセキュリティ設定を適用してください

3. **状態管理**: 初期はローカルバックエンドを使用しています。チーム開発や本番環境では、S3バックエンドへの移行を検討してください。

4. **データベース接続**: RDSはプライベートサブネットに配置されているため、EC2インスタンスからのみアクセス可能です。

## トラブルシューティング

### EC2に接続できない

1. セキュリティグループでSSH（ポート22）が許可されているか確認
2. キーペアが正しく設定されているか確認
3. EC2インスタンスのパブリックIPを確認

### データベースに接続できない

1. RDSセキュリティグループでEC2セキュリティグループからの3306ポートが許可されているか確認
2. RDSがプライベートサブネットに配置されているか確認
3. データベースのエンドポイントと認証情報を確認

### User Dataスクリプトが実行されない

1. EC2インスタンスのログを確認：

   ```bash
   ssh -i ~/.ssh/your-key.pem ec2-user@<public-ip>
   sudo cat /var/log/user-data.log
   ```

2. 手動でスクリプトを実行してエラーを確認

## 次のステップ

- [ ] S3バックエンドへの移行
- [ ] ALB（Application Load Balancer）の追加
- [ ] Auto Scaling Groupの追加
- [ ] CloudWatch監視の設定
- [ ] 本番環境（prod）の追加
