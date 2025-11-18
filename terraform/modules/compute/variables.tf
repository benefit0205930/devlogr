variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "devlogr"
}

variable "public_subnet_id" {
  description = "Public subnet ID for EC2"
  type        = string
}

variable "security_group_id" {
  description = "Security group ID for EC2"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID for EC2 instance (if not provided, will use latest Amazon Linux 2023)"
  type        = string
  default     = ""
}

variable "key_pair_name" {
  description = "Name of the EC2 Key Pair"
  type        = string
}

variable "db_host" {
  description = "RDS database host"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "devlogr"
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "app_url" {
  description = "Application URL"
  type        = string
}

variable "github_repo_url" {
  description = "GitHub repository URL for cloning the application"
  type        = string
  default     = ""
}

variable "app_key" {
  description = "Laravel application key (should be generated)"
  type        = string
  sensitive   = true
}

