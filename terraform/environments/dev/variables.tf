variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "devlogr"
}

variable "db_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "admin"
}

variable "key_pair_name" {
  description = "EC2 Key Pair name"
  type        = string
}

variable "app_key" {
  description = "Laravel application key (generate with: php artisan key:generate --show)"
  type        = string
  sensitive   = true
}

variable "github_repo_url" {
  description = "GitHub repository URL (optional, leave empty for manual setup)"
  type        = string
  default     = ""
}

variable "app_url" {
  description = "Application URL (will be set to EC2 public IP after creation)"
  type        = string
  default     = "http://ec2-instance"
}

