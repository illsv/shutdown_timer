// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::utils::shutdown_command::shutdown_resolver;
pub mod utils;

#[tauri::command]
fn shutdown_action(mode: &str) {
    shutdown_resolver(mode);
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![shutdown_action])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
