use std::process::Stdio;
use tauri::{Window , Emitter };
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

pub async fn exec_into_container(
    window: Window,
    container: String,
    command: String,
) -> Result<(), String> {
    let mut child = Command::new("docker")
        .args(["exec", "-i", &container, "sh", "-c", &command])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take().unwrap();
    let reader = BufReader::new(stdout);
    let mut lines = reader.lines();

    while let Some(line) = lines.next_line().await.map_err(|e| e.to_string())? {
        let _ = window.emit("exec-output", line);
    }

    Ok(())
}