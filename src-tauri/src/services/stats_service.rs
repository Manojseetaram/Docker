use std::process::Command;
use serde_json::Value;
use crate::models::stats::ContainerStats;

pub fn get_all_container_stats() -> Result<Vec<ContainerStats>, String> {
    let output = Command::new("docker")
        .args([
            "stats",
            "--no-stream",
            "--format",
            "{{json .}}"
        ])
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err("Failed to execute docker stats".into());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    let mut stats_list = Vec::new();

    for line in stdout.lines() {
        let parsed: Value = serde_json::from_str(line)
            .map_err(|e| e.to_string())?;

        let stats = ContainerStats {
            name: parsed["Name"].as_str().unwrap_or("").to_string(),
            cpu: parsed["CPUPerc"].as_str().unwrap_or("").to_string(),
            memory: parsed["MemUsage"].as_str().unwrap_or("").to_string(),
            memory_percent: parsed["MemPerc"].as_str().unwrap_or("").to_string(),
        };

        stats_list.push(stats);
    }

    Ok(stats_list)
}