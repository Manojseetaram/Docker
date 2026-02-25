use crate::services::system_service;
use crate::models::stats::SystemStats;

#[tauri::command]
pub fn get_stats() -> Result<SystemStats, String> {
    system_service::get_stats()
}