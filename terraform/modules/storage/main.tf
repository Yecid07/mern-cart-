resource "google_storage_bucket" "app_bucket" {
  name          = "${var.app_name}-bucket-${var.environment}-${data.google_client_config.current.project}"
  location      = "US"
  force_destroy = true

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 3
    }
  }
}

data "google_client_config" "current" {}
