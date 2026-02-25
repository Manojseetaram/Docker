use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ContainerStats {
    pub name: String,
    pub cpu: String,
    pub memory: String,
    pub memory_percent: String,
}