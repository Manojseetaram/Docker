use crate::services::container_service;
use crate::models::container::Container;

#[tauri::command]
pub fn list_containers() -> Result<Vec<Container>, String> {
    container_service::list_containers()
}

#[tauri::command]
pub fn start_container(name: String) -> Result<String, String> {
    container_service::start_container(name)
}

#[tauri::command]
pub fn stop_container(name: String) -> Result<String, String> {
    container_service::stop_container(name)
}

#[tauri::command]
pub fn remove_container(name: String) -> Result<String, String> {
    container_service::remove_container(name)
}

#[tauri::command]
pub fn run_container(
    image: String,
    name: Option<String>,
    ports: Option<String>,
    cmd: Option<String>,
) -> Result<String, String> {
    container_service::run_container(image, name, ports, cmd)
}