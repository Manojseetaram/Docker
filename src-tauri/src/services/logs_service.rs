use std::process::Stdio;
use tauri::{Window, Emitter};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

pub async fn stream_logs(
    window: Window,
    container: String,
) -> Result<(), String> {
    let mut child = Command::new("docker")
        .args(["logs", "-f", &container])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take().unwrap();
    let reader = BufReader::new(stdout);
    let mut lines = reader.lines();

    while let Some(line) = lines.next_line().await.map_err(|e| e.to_string())? {
        let _ = window.emit("container-log", line);
    }

    Ok(())
}