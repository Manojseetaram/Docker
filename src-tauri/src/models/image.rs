use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Image {
    pub id: String,
    pub name: String,
    pub tag: String,
}