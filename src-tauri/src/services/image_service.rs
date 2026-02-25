use std::process::Command;
use crate::models::image::Image;

pub fn list_images() -> Result<Vec<Image>, String> {
    let output = Command::new("docker")
        .args(["images", "--format", "{{.ID}}|{{.Repository}}|{{.Tag}}|{{.Size}}"])
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err("Failed to fetch images".into());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    let images = stdout
        .lines()
        .map(|line| {
            let parts: Vec<&str> = line.split('|').collect();
            Image {
                id: parts.get(0).unwrap_or(&"").to_string(),
                repository: parts.get(1).unwrap_or(&"").to_string(),
                tag: parts.get(2).unwrap_or(&"").to_string(),
                size: parts.get(3).unwrap_or(&"").to_string(),
            }
        })
        .collect();

    Ok(images)
}
pub fn pull_image(name: String, tag: String) -> Result<String, String> {
    let full_image = format!("{}:{}", name, tag);

    let output = Command::new("docker")
        .args(["pull", &full_image])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Image pulled successfully".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

pub fn remove_image(name: String) -> Result<String, String> {
    let output = Command::new("docker")
        .args(["rmi", &name])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Image removed".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}