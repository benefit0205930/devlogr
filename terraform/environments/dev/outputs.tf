output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "ec2_public_ip" {
  description = "EC2 instance public IP address"
  value       = module.compute.instance_public_ip
}

output "ec2_public_dns" {
  description = "EC2 instance public DNS name"
  value       = module.compute.instance_public_dns
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.database.db_instance_endpoint
}

output "rds_address" {
  description = "RDS instance address"
  value       = module.database.db_instance_address
}

output "application_url" {
  description = "Application URL (update this after EC2 is created)"
  value       = "http://${module.compute.instance_public_ip}"
}

output "ssh_command" {
  description = "SSH command to connect to EC2 instance"
  value       = "ssh -i ~/.ssh/${var.key_pair_name}.pem ec2-user@${module.compute.instance_public_ip}"
}

output "database_connection_info" {
  description = "Database connection information"
  value = {
    host     = module.database.db_instance_address
    port     = module.database.db_instance_port
    database = module.database.db_name
    username = module.database.db_instance_username
  }
  sensitive = true
}

