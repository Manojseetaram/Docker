use tauri::State;
use crate::state::AppState;
use crate::services::image_service;

#[tauri::command]
pub fn list_images(state: State<AppState>)
    -> Vec<crate::models::image::Image>
{
    image_service::list_images(&state)
}

#[tauri::command]
pub fn pull_image(
    state: State<AppState>,
    name: String,
    tag: String,
) -> crate::models::image::Image
{
    image_service::pull_image(&state, name, tag)
}