let timerStart = false;
let seconds = 1;
let ticker: number;

self.onmessage = e => {
  if (e.data === 'STOP') {
    seconds = 1;
    clearInterval(ticker);
  }

  if (e.data === 'START') {
    timerStart = true;
  }

  if (timerStart) {
    timerStart = false;
    ticker = setInterval(() => {
      postMessage(seconds);
      seconds++;
    }, 1000);
  }
};
