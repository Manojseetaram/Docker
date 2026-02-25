use crate::services::image_service;
use crate::models::image::Image;

#[tauri::command]
pub fn list_images() -> Result<Vec<Image>, String> {
    image_service::list_images()
}

#[tauri::command]
pub fn pull_image(name: String, tag: String) -> Result<String, String> {
    image_service::pull_image(name, tag)
}

#[tauri::command]
pub fn remove_image(name: String) -> Result<String, String> {
    image_service::remove_image(name)
}