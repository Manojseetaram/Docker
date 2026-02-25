use uuid::Uuid;
use crate::models::image::Image;
use crate::state::AppState;

pub fn list_images(state: &AppState) -> Vec<Image> {
    state.images.lock().unwrap().clone()
}

pub fn pull_image(state: &AppState, name: String, tag: String) -> Image {
    let image = Image {
        id: Uuid::new_v4().to_string(),
        name,
        tag,
    };

    state.images.lock().unwrap().push(image.clone());
    image
}