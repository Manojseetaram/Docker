// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod services;
mod models;
mod state;

use state::AppState;
use std::sync::Mutex;
use commands::*;

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            containers: Mutex::new(Vec::new()),
            images: Mutex::new(Vec::new()),
        })
        .invoke_handler(tauri::generate_handler![
            list_containers,
            create_container,
            start_container,
            stop_container,
            list_images,
            pull_image,
            get_stats
        ])
        .run(tauri::generate_context!())
        .expect("error while running app");
}