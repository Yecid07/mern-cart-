output "public_ip" {
  value = google_compute_instance.app_server.network_interface[0].access_config[0].nat_ip
}

output "internal_ip" {
  value = google_compute_instance.app_server.network_interface[0].network_ip
}

output "instance_id" {
  value = google_compute_instance.app_server.id
}

output "instance_name" {
  value = google_compute_instance.app_server.name
}
