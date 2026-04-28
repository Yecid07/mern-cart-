variable "gcp_project_id" {
  description = "ID del proyecto en Google Cloud"
  type        = string
}

variable "gcp_region" {
  description = "Región de Google Cloud"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "app_name" {
  description = "Nombre de la aplicación"
  type        = string
  default     = "cart-api"
}

variable "mongodb_atlas_uri" {
  description = "Connection string de MongoDB Atlas"
  type        = string
  sensitive   = true
}

variable "machine_type" {
  description = "Tipo de máquina para Compute Engine"
  type        = string
  default     = "e2-medium"
}
