use serde::Serialize;

#[derive(Serialize)]
pub struct SystemStats {
    pub total_containers: usize,
    pub running_containers: usize,
    pub total_images: usize,
}