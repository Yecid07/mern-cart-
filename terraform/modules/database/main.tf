# Módulo para MongoDB Atlas
# Requiere que tengas una cuenta en MongoDB Atlas y hayas creado un proyecto

resource "random_password" "mongodb_password" {
  length  = 32
  special = true
}

variable "create_local_config" {
  type    = bool
  default = true
}

# Archivo de configuración local para MongoDB
resource "local_file" "mongodb_connection_info" {
  count    = var.create_local_config ? 1 : 0
  filename = "${path.module}/../../scripts/mongodb_atlas_info.txt"
  content  = <<-EOF
    MongoDB Atlas Connection Information
    ====================================

    Para conectarse a MongoDB Atlas remotamente:

    1. Ve a: https://cloud.mongodb.com/v2
    2. Selecciona tu proyecto
    3. Ve a Database Deployments
    4. Haz clic en "Connect"
    5. Selecciona "Atlas CLI" o "Connection String"
    6. Usa la URI en tu aplicación

    Para usar mongosh:
    mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cart_production"

    Para scripts de MongoDB:
    mongosh --uri "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cart_production" < script.js
  EOF
}
