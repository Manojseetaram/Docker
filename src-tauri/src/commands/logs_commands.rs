use tauri::Window;
use crate::services::logs_service;

#[tauri::command]
pub async fn stream_logs(
    window: Window,
    container: String,
) -> Result<(), String> {
    logs_service::stream_logs(window, container).await
}