use tauri::State;
use crate::state::AppState;
use crate::services::system_service;

#[tauri::command]
pub fn get_stats(state: State<AppState>)
    -> crate::models::stats::SystemStats
{
    system_service::get_stats(&state)
}