# Staging Environment Configuration

terraform {
  backend "local" {
    path = "../../terraform.tfstate.staging"
  }
}

module "infrastructure" {
  source = "../../"

  gcp_project_id       = "tu-project-id"
  gcp_region           = "us-central1"
  environment          = "staging"
  app_name             = "cart-api"
  machine_type         = "e2-standard-2"
  mongodb_root_password = "tu-contraseña-fuerte-staging"
}

output "staging_outputs" {
  value = {
    vpc_network_id        = module.infrastructure.vpc_network_id
    compute_engine_ip     = module.infrastructure.compute_engine_ip
    storage_bucket_name   = module.infrastructure.storage_bucket_name
  }
}
