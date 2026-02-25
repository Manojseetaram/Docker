// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod services;
mod models;


use commands::*;

fn main() {
    tauri::Builder::default()
        
        .invoke_handler(tauri::generate_handler![
            list_containers,
            
            start_container,
            stop_container,
            list_images,
            pull_image,
            get_stats
        ])
        .run(tauri::generate_context!())
        .expect("error while running app");
}