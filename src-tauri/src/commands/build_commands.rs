use tauri::Window;
use crate::services::build_service;

#[tauri::command]
pub async fn build_image(
    window: Window,
    path: String,
    tag: String,
) -> Result<String, String> {
    build_service::build_image(window, path, tag).await
}