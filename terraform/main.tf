# Módulo de Red
module "network" {
  source = "./modules/network"

  app_name      = var.app_name
  environment   = var.environment
  gcp_region    = var.gcp_region
}

# Módulo de Base de Datos (MongoDB Atlas)
module "database" {
  source = "./modules/database"

  app_name    = var.app_name
  environment = var.environment
  vpc_id      = module.network.vpc_id
}

# Módulo de Compute Engine
module "compute" {
  source = "./modules/compute"

  app_name             = var.app_name
  environment          = var.environment
  gcp_region           = var.gcp_region
  machine_type         = var.machine_type
  vpc_network_name     = module.network.vpc_name
  subnet_name          = module.network.subnet_name
  mongodb_atlas_uri    = var.mongodb_atlas_uri
  firewall_rule_id     = module.network.firewall_rule_id
}

# Módulo de Almacenamiento
module "storage" {
  source = "./modules/storage"

  app_name    = var.app_name
  environment = var.environment
}
