variable "app_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "machine_type" {
  type    = string
  default = "e2-medium"
}

variable "vpc_network_name" {
  type = string
}

variable "subnet_name" {
  type = string
}

variable "mongodb_atlas_uri" {
  type      = string
  sensitive = true
  description = "Connection string de MongoDB Atlas"
}

variable "firewall_rule_id" {
  type = string
}
