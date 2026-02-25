use tauri::Window;
use crate::services::exec_service;

#[tauri::command]
pub async fn exec_into_container(
    window: Window,
    container: String,
    command: String,
) -> Result<(), String> {
    exec_service::exec_into_container(window, container, command).await
}