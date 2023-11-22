use std::{sync::Arc, time::Duration};
use tokio::time::Instant;

use crate::state::GameState;

#[tauri::command]
/// Controls a timer that emits every second to the frontend.
///
/// # Arguments
///
/// - `method` - A string indicating the action to perform on the timer. It can be either "start" or "stop".
/// - `state` - A shared state object that contains the current state of the application.
/// - `window` - A window object that represents the application window.
///
pub fn timer(method: &str, state: tauri::State<GameState>, window: tauri::Window) {
    let mut running = state.running.lock().unwrap();
    let start_time = Instant::now();

    match method {
        "start" => {
            *running = true;
        }
        "stop" => {
            *running = false;
        }
        _ => (),
    }

    if *running {
        let running_inner = Arc::clone(&state.running);
        let time_inner = Arc::clone(&state.time);
        tauri::async_runtime::spawn(async move {
            println!("Game running");

            loop {
                tokio::time::sleep(Duration::from_secs(1)).await;

                let mut time = time_inner.lock().unwrap();
                let current_time = Instant::now();
                let elapsed = current_time.duration_since(start_time);
                let elapsed_secs = elapsed.as_secs();

                if !*running_inner.lock().unwrap() {
                    println!("Game stopped at {} seconds", time);
                    break;
                }

                *time = elapsed_secs;
                window.emit("timer_tick", time.clone()).unwrap();
            }
        });
    }
}
