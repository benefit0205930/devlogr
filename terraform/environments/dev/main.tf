terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 利用可能なAZを取得
data "aws_availability_zones" "available" {
  state = "available"
}

# Networking Module
module "networking" {
  source = "../../modules/networking"

  vpc_cidr            = "10.0.0.0/16"
  availability_zones  = slice(data.aws_availability_zones.available.names, 0, 2)
  environment         = var.environment
  project_name        = var.project_name
  public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]
}

# Database Module
module "database" {
  source = "../../modules/database"

  environment          = var.environment
  project_name         = var.project_name
  private_subnet_ids   = module.networking.private_subnet_ids
  security_group_id    = module.networking.rds_security_group_id
  db_instance_class    = "db.t2.micro"
  db_allocated_storage = 20
  db_engine_version    = "8.0"
  db_name              = "devlogr"
  db_username          = var.db_username
  db_password          = var.db_password
  backup_retention_period = 7
  skip_final_snapshot    = true
}

# Compute Module
module "compute" {
  source = "../../modules/compute"

  environment       = var.environment
  project_name      = var.project_name
  public_subnet_id  = module.networking.public_subnet_ids[0]
  security_group_id = module.networking.ec2_security_group_id
  instance_type     = "t2.micro"
  key_pair_name     = var.key_pair_name
  db_host           = module.database.db_instance_address
  db_name           = module.database.db_name
  db_username       = var.db_username
  db_password       = var.db_password
  app_url           = var.app_url  # EC2作成後に手動で更新するか、後で修正
  github_repo_url   = var.github_repo_url
  app_key           = var.app_key

  depends_on = [module.database]
}

