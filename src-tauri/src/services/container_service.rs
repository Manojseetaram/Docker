use uuid::Uuid;
use crate::models::container::Container;
use crate::state::AppState;

pub fn list_containers(state: &AppState) -> Vec<Container> {
    state.containers.lock().unwrap().clone()
}

pub fn create_container(
    state: &AppState,
    name: String,
    image: String,
) -> Container {

    let container = Container {
        id: Uuid::new_v4().to_string(),
        name,
        image,
        status: "created".into(),
    };

    state.containers.lock().unwrap().push(container.clone());
    container
}

pub fn start_container(state: &AppState, id: String) -> Result<String, String> {
    let mut containers = state.containers.lock().unwrap();

    if let Some(container) = containers.iter_mut().find(|c| c.id == id) {
        container.status = "running".into();
        return Ok("Container started".into());
    }

    Err("Container not found".into())
}

pub fn stop_container(state: &AppState, id: String) -> Result<String, String> {
    let mut containers = state.containers.lock().unwrap();

    if let Some(container) = containers.iter_mut().find(|c| c.id == id) {
        container.status = "stopped".into();
        return Ok("Container stopped".into());
    }

    Err("Container not found".into())
}