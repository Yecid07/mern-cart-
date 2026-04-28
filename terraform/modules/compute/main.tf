resource "google_compute_instance" "app_server" {
  name         = "${var.app_name}-server-${var.environment}"
  machine_type = var.machine_type
  zone         = "${var.gcp_region}-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-lts"
      size  = 30
    }
  }

  network_interface {
    network            = var.vpc_network_name
    subnetwork         = var.subnet_name
    access_config {}
  }

  metadata_startup_script = base64encode(templatefile("${path.module}/../../scripts/setup_server.sh", {
    mongodb_uri = var.mongodb_atlas_uri
  }))

  tags = ["app-server", "${var.app_name}", var.environment]

  depends_on = [var.firewall_rule_id]
}

