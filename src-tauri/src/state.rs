use std::sync::Mutex;
use crate::models::{container::Container, image::Image};

pub struct AppState {
    pub containers: Mutex<Vec<Container>>,
    pub images: Mutex<Vec<Image>>,
}