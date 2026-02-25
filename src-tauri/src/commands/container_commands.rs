use tauri::State;
use crate::state::AppState;
use crate::services::container_service;

#[tauri::command]
pub fn list_containers(state: State<AppState>) 
    -> Vec<crate::models::container::Container> 
{
    container_service::list_containers(&state)
}

#[tauri::command]
pub fn create_container(
    state: State<AppState>,
    name: String,
    image: String,
) -> crate::models::container::Container 
{
    container_service::create_container(&state, name, image)
}

#[tauri::command]
pub fn start_container(
    state: State<AppState>,
    id: String,
) -> Result<String, String> 
{
    container_service::start_container(&state, id)
}

#[tauri::command]
pub fn stop_container(
    state: State<AppState>,
    id: String,
) -> Result<String, String> 
{
    container_service::stop_container(&state, id)
}