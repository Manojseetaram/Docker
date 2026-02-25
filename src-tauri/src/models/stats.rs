use serde::{Serialize , Deserialize};

#[derive(Serialize)]
pub struct SystemStats {
    pub total_containers: usize,
    pub running_containers: usize,
    pub total_images: usize,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct ContainerStats {
    pub name: String,
    pub cpu: String,
    pub memory: String,
    pub memory_percent: String,
}