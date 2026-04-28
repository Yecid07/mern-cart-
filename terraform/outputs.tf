output "vpc_network_id" {
  description = "ID de la VPC"
  value       = module.network.vpc_id
}

output "compute_engine_ip" {
  description = "IP pública de Compute Engine"
  value       = module.compute.public_ip
}

output "compute_engine_internal_ip" {
  description = "IP interna de Compute Engine"
  value       = module.compute.internal_ip
}

output "storage_bucket_name" {
  description = "Nombre del bucket de Cloud Storage"
  value       = module.storage.bucket_name
}

output "mongodb_atlas_connection_info" {
  description = "Información de conexión a MongoDB Atlas"
  value       = "Usa la URI configurada en terraform.tfvars"
  sensitive   = true
}
