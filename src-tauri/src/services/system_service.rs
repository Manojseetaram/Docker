use crate::models::stats::SystemStats;
use crate::state::AppState;

pub fn get_stats(state: &AppState) -> SystemStats {
    let containers = state.containers.lock().unwrap();
    let images = state.images.lock().unwrap();

    let running = containers.iter().filter(|c| c.status == "running").count();

    SystemStats {
        total_containers: containers.len(),
        running_containers: running,
        total_images: images.len(),
    }
}