use crate::GameState;
use std::{sync::Arc, time::Duration};
use tokio::time::Instant;

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
        tauri::async_runtime::spawn(async move {
            println!("Async timer started");

            for _elapsed_seconds in 0..999 {
                tokio::time::sleep(Duration::from_secs(1)).await;

                let current_time = Instant::now();
                let elapsed = current_time.duration_since(start_time);
                let elapsed_secs = elapsed.as_secs();

                if !*running_inner.lock().unwrap() {
                    println!("Timer stopped at {} seconds", elapsed_secs);
                    break;
                }

                window.emit("timer_tick", Some(elapsed_secs)).unwrap();
            }
        });

        println!("Timer hit max");
    }
}
