use crate::services::stats_service;

#[tauri::command]
pub fn get_all_container_stats() 
    -> Result<Vec<crate::models::stats::ContainerStats>, String> 
{
    stats_service::get_all_container_stats()
}