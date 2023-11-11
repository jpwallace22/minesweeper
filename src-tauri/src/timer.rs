// use std::iter;
// use std::old_io::timer;
// use std::old_io::Timer;
// use std::sync::mpsc;
// use std::time::duration::Duration;

// fn main() {
//     let interval = Duration::milliseconds(1000);
//     let mut timer = Timer::new().unwrap();
//     let metronome: mpsc::Receiver<()> = timer.periodic(interval);

//     println!("Countdown");
//     for i in iter::range_step(999i32, 0, 1) {
//         // This loop will run once every second
//         let _ = metronome.recv();

//         println!("{}", i);
//     }
//     let _ = metronome.recv();
// }

use std::io::timer;
use std::io::Timer;
use std::iter;
use std::sync::mpsc;
use std::time::duration::Duration;

fn main() {
    let interval = Duration::milliseconds(1000);
    // Create a timer object
    let mut timer = Timer::new().unwrap();

    // Create a one-shot notification
    // (superfluous type annotation)
    let oneshot: mpsc::Receiver<()> = timer.oneshot(interval);

    println!("Wait {} ms...", interval.num_milliseconds());

    // Block the thread until notification arrives
    let _ = oneshot.recv();

    println!("Done");

    println!("Sleep for {} ms...", interval.num_milliseconds());

    // This is equivalent to `timer.oneshot(interval).recv()`
    timer::sleep(interval);

    println!("Done");

    // The same timer can be used to generate periodic notifications
    // (superfluous type annotation)
    let metronome: mpsc::Receiver<()> = timer.periodic(interval);

    println!("Countdown");
    for i in iter::range_step(5i32, 0, -1) {
        // This loop will run once every second
        let _ = metronome.recv();

        println!("{}", i);
    }
    let _ = metronome.recv();
    println!("Ignition!");
}
