# 初期はローカルバックエンドを使用
# 動作確認後、S3バックエンドに移行する場合は以下のコメントを解除して設定
#
# terraform {
#   backend "s3" {
#     bucket         = "devlogr-terraform-state"
#     key            = "dev/terraform.tfstate"
#     region         = "ap-northeast-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }

