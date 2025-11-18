# Data source for latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 Instance
resource "aws_instance" "main" {
  ami                    = var.ami_id != "" ? var.ami_id : data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = var.key_pair_name
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.security_group_id]

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    environment     = var.environment
    db_host         = var.db_host
    db_name         = var.db_name
    db_username     = var.db_username
    db_password     = var.db_password
    app_url         = var.app_url
    github_repo_url = var.github_repo_url != "" ? var.github_repo_url : ""
    app_key         = var.app_key
  }))

  # Root volume
  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = false
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Elastic IP (オプション: 固定IPが必要な場合)
# resource "aws_eip" "main" {
#   instance = aws_instance.main.id
#   domain   = "vpc"
#
#   tags = {
#     Name        = "${var.project_name}-${var.environment}-eip"
#     Environment = var.environment
#     Project     = var.project_name
#   }
# }

