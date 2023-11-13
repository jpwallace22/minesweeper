// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::menu::AddDefaultSubmenus;
use std::sync::{Arc, Mutex};
use tauri::Menu;

pub struct GameState {
    running: Arc<Mutex<bool>>,
}

mod menu;
mod timer;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(GameState {
            running: Mutex::new(false).into(),
        })
        .menu(
            Menu::new()
                .add_default_app_submenu_if_macos("Minesweeper")
                .add_custom_game_menu()
                .add_default_file_submenu()
                .add_default_edit_submenu()
                .add_default_view_submenu()
                .add_default_window_submenu(),
        )
        .on_menu_event(|event| match event.menu_item_id() {
            "easy" => event
                .window()
                .emit("difficulty_setting", "easy".to_string())
                .unwrap(),
            "medium" => event
                .window()
                .emit("difficulty_setting", "medium".to_string())
                .unwrap(),
            "hard" => event
                .window()
                .emit("difficulty_setting", "hard".to_string())
                .unwrap(),
            "scores" => event
                .window()
                .emit("windows", "scores".to_string())
                .unwrap(),
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![timer::timer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
