#![allow(dead_code)]

use std::sync::{Arc, Mutex};
use ts_rs::TS;

#[derive(TS)]
#[ts(export, export_to = "../src/generated/GameDifficulty.ts")]
pub enum GameDifficulty {
    Easy,
    Medium,
    Hard,
}

#[derive(TS)]
#[ts(export, export_to = "../src/generated/GameState.ts")]
pub struct GameState {
    pub running: Arc<Mutex<bool>>,
    pub time: Arc<Mutex<u64>>,
    pub difficulty: Mutex<GameDifficulty>,
}

impl GameState {
    pub fn init() -> GameState {
        GameState {
            running: Mutex::new(false).into(),
            time: Mutex::new(0).into(),
            difficulty: Mutex::new(GameDifficulty::Easy.into()),
        }
    }
}
