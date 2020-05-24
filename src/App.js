import React from "react";
import "./styles.css";

export default function PomodoroClock() {
  // app state
  const [breakMinutes, setBreakMinutes] = React.useState(5);
  const [sessionMinutes, setSessionMinutes] = React.useState(25);
  const [timerMinutes, setTimerMinutes] = React.useState(25);
  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [label, setLabel] = React.useState("Start");
  const [loopActive, setLoopActive] = React.useState(null);
  const [timerType, setTimerType] = React.useState("SESSION");

  // starts/stops the interval
  const startStopHandler = () => {
    // change label from "Start" to "Stop" and reverse
    label === "Start" ? setLabel("Stop") : setLabel("Start");
    // activates interval only if interval is not running and "Start" label exist
    loopActive === null && label === "Start"
      ? setLoopActive(1000)
      : setLoopActive(null);
  };

  // contains timer changing logic
  const changeTimerType = () => {
    if (timerType === "SESSION") {
      setTimerMinutes(breakMinutes);
      setTimerSeconds(0);
      setTimerType("BREAK");
    } else if (timerType === "BREAK") {
      setTimerMinutes(sessionMinutes);
      setTimerSeconds(0);
      setTimerType("SESSION");
    }
  };

  // changes timer number values
  const updateTimer = () => {
    if (timerMinutes === 0 && timerSeconds === 0) {
      // e: 00:00 -> next iteration: breaks or session
      this.audioBeep.play();
      changeTimerType();
      return;
    }
    if (timerSeconds > 0) {
      setTimerSeconds(timerSeconds - 1);
      return;
    }
    if (timerSeconds === 0) {
      // e: 24:00 -> 23:59
      setTimerMinutes(timerMinutes - 1);
      setTimerSeconds(59);
      return;
    }
  };

  // contains clock reset logic
  const handleReset = () => {
    // stop audio if still playing
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    // reset state
    setBreakMinutes(5);
    setSessionMinutes(25);
    setTimerMinutes(25);
    setTimerSeconds(0);
    setLabel("Start");
    setTimerType("SESSION");
    setLoopActive(null);
  };

  // custom hook
  useInterval(() => {
    updateTimer();
  }, loopActive);

  // contains timer minute and session minute change
  React.useEffect(() => {
    setTimerMinutes(sessionMinutes);
  }, [sessionMinutes]);

  return (
    <main className="center text-center">
      <section className="timer">
        <Timer type={timerType} minutes={timerMinutes} seconds={timerSeconds} />
        <div className="timer__controls">
          <Controlls label={label} action={startStopHandler} />
          <Controlls label="Reset" action={handleReset} />
        </div>
        <div className="settings">
          <NumberChanger
            type="Session"
            value={[sessionMinutes, setSessionMinutes]}
          />
          <NumberChanger type="Break" value={[breakMinutes, setBreakMinutes]} />
        </div>
        <audio
          id="beep"
          preload="auto"
          src="https://goo.gl/65cBl1"
          ref={audio => {
            this.audioBeep = audio;
          }}
        />
      </section>
    </main>
  );
}

function useInterval(callback, delay) {
  // custom hook: implements setInterval in React Hook style
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  const savedCallback = React.useRef();
  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// clock timer display
function Timer({ type, minutes, seconds }) {
  // corrects minutes display
  const timeFormat = input =>
    input === 0 ? "00" : input <= 9 ? `0${input}` : input;
  // formats displayed numbers
  const displayFormat = `${timeFormat(minutes)}:${timeFormat(seconds)}`;
  return (
    <section className="timer__display">
      <p className="text-big text-center">{type}</p>
      <p className="text-bigger text-center">{displayFormat}</p>
    </section>
  );
}

// clock controlls buttons
function Controlls({ label, action }) {
  return (
    <button className="button" onClick={action}>
      {label}
    </button>
  );
}

function NumberChanger({ type, value, eventHandler }) {
  const [val, setVal] = value;

  // contains add and sub logic of session and break minutes
  const handleClick = event => {
    // minutes min: 1 and max: 60
    if (event.target.value === "ADD") {
      setVal(val < 60 ? val + 1 : val);
    } else if (event.target.value === "SUB") {
      setVal(val > 1 ? val - 1 : val);
    }
  };

  return (
    <section className="settings__section">
      <div>
        <p className="text-big">{type}</p>
      </div>
      <div className="setting__controls">
        <button
          className="button button-small"
          value="SUB"
          onClick={handleClick}
        >
          -
        </button>
        <p>{val}</p>
        <button
          className="button button-small"
          value="ADD"
          onClick={handleClick}
        >
          +
        </button>
      </div>
    </section>
  );
}
