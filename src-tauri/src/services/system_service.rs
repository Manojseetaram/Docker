use std::process::Command;
use crate::models::stats::SystemStats;

pub fn get_stats() -> Result<SystemStats, String> {

    // Total containers (all)
    let all_containers = Command::new("docker")
        .args(["ps", "-a", "-q"])
        .output()
        .map_err(|e| e.to_string())?;

    // Running containers
    let running_containers = Command::new("docker")
        .args(["ps", "-q"])
        .output()
        .map_err(|e| e.to_string())?;

    // Images
    let images = Command::new("docker")
        .args(["images", "-q"])
        .output()
        .map_err(|e| e.to_string())?;

    if !all_containers.status.success()
        || !running_containers.status.success()
        || !images.status.success()
    {
        return Err("Failed to fetch Docker stats".into());
    }

    let total = String::from_utf8_lossy(&all_containers.stdout)
        .lines()
        .count();

    let running = String::from_utf8_lossy(&running_containers.stdout)
        .lines()
        .count();

    let total_images = String::from_utf8_lossy(&images.stdout)
        .lines()
        .count();

    Ok(SystemStats {
        total_containers: total,
        running_containers: running,
        total_images,
    })
}