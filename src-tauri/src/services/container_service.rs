use std::process::Command;
use crate::models::container::Container;

pub fn list_containers() -> Result<Vec<Container>, String> {

    let output = Command::new("docker")
        .args(["ps", "-a", "--format", "{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}"])
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err("Failed to fetch containers".into());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    let containers = stdout
        .lines()
        .map(|line| {
            let parts: Vec<&str> = line.split('|').collect();

            Container {
                id: parts[0].to_string(),
                name: parts[1].to_string(),
                image: parts[2].to_string(),
                status: parts[3].to_string(),
            }
        })
        .collect();

    Ok(containers)
}

pub fn start_container(name: String) -> Result<String, String> {
    let output = Command::new("docker")
        .args(["start", &name])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Container started".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

pub fn stop_container(name: String) -> Result<String, String> {
    let output = Command::new("docker")
        .args(["stop", &name])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Container stopped".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

pub fn remove_container(name: String) -> Result<String, String> {
    // Stop the container first (ignore error if already stopped)
    let _ = Command::new("docker").args(["stop", &name]).output();

    let output = Command::new("docker")
        .args(["rm", &name])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Container removed".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
pub fn run_container(
    image: String,
    name: Option<String>,
    ports: Option<String>,
    cmd: Option<String>,
) -> Result<String, String> {

    let mut args: Vec<String> = vec!["run".into(), "-d".into()];

    // Container name
    if let Some(n) = name {
        args.push("--name".into());
        args.push(n);
    }

    // Port mapping (example: "8080:80")
    if let Some(p) = ports {
        args.push("-p".into());
        args.push(p);
    }

    args.push(image);

    // Custom command
    if let Some(c) = cmd {
        args.push(c);
    }

    let output = Command::new("docker")
        .args(&args)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Container started successfully".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}