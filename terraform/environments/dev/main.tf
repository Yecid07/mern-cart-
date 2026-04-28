# Development Environment Configuration

terraform {
  backend "local" {
    path = "../../terraform.tfstate.dev"
  }
}

module "infrastructure" {
  source = "../../"

  gcp_project_id       = "tu-project-id"
  gcp_region           = "us-central1"
  environment          = "dev"
  app_name             = "cart-api"
  machine_type         = "e2-medium"
  mongodb_root_password = "tu-contraseña-fuerte-dev"
}

output "dev_outputs" {
  value = {
    vpc_network_id        = module.infrastructure.vpc_network_id
    compute_engine_ip     = module.infrastructure.compute_engine_ip
    storage_bucket_name   = module.infrastructure.storage_bucket_name
  }
}
