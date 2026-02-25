use std::process::Stdio;
use tauri::{Window , Emitter };
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

pub async fn build_image(
    window: Window,
    path: String,
    tag: String,
) -> Result<String, String> {
    let mut child = Command::new("docker")
        .args(["build", "-t", &tag, &path])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take().unwrap();
    let reader = BufReader::new(stdout);
    let mut lines = reader.lines();

    while let Some(line) = lines.next_line().await.map_err(|e| e.to_string())? {
        let _ = window.emit("build-log", line);
    }

    let status = child.wait().await.map_err(|e| e.to_string())?;

    if status.success() {
        Ok("Build completed successfully".into())
    } else {
        Err("Build failed".into())
    }
}