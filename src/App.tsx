import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [ timerActive, setTimerActive ] = useState<boolean>(false);
  const [ secondsAmount, setSecondsAmount ] = useState<number>(0);

  const [ hours, setHours ] = useState<number>(0);
  const [ minutes, setMinutes ] = useState<number>(0);
  const [ seconds, setSeconds ] = useState<number>(0);

  useEffect(() => {
    if(!secondsAmount) return
    if(!timerActive) return

    const interval = setInterval(() => {
      const seconds = secondsAmount - 1
      setSecondsAmount(seconds);
      setReturnValues(seconds)
    }, 1000);

    return () => clearInterval(interval)
  }, [secondsAmount, timerActive]);


  const toggleTimer = () => {
    setTimerActive(!timerActive)
  }

  const addMinutesToTimer = (amount: number) => {
    const seconds = secondsAmount + (amount * 60)
    setSecondsAmount(seconds)
    setReturnValues(seconds)
  }

  const clearTimerMinutes = () => {
    setTimerActive(false)
    setSecondsAmount(0)
    setReturnValues(0)
  }

  const setReturnValues = (seconds: number) => {
    setHours(Math.floor(seconds / 60 / 60))
    setMinutes(Math.floor(seconds / 60) % 60)
    setSeconds(seconds % 60)
  };

  const formatTimeCell = (val: number) => {
    return val ? val : '00'
  }



  return (
    <div className="container">
      <h1>Shutdown Timer</h1>

      <form>
        <div className="mode-selection">
          <label htmlFor="shutdown-opt">Mode:</label>
          <select name="shutdown-mode" id="shutdown-opt">
              <option value="shutdown">Shutdown</option>
              <option value="restart">Restart</option>
              <option value="sleep">Sleep</option>
          </select>
        </div>

        <div className="min-row">
          <button type="button" onClick={ () => {addMinutesToTimer(5)} }>5</button>
          <button type="button" onClick={ () => {addMinutesToTimer(10)} }>10</button>
          <button type="button" onClick={ () => {addMinutesToTimer(30)} }>30</button>
          <button type="button" onClick={ () => {addMinutesToTimer(60)} }>60</button>
          <button type="button" onClick={ () => {addMinutesToTimer(120)} }>120</button>
        </div>

        <button type="button" id='clear-timer' onClick={clearTimerMinutes}>Clear</button>
      </form>

      <div className="countdown">
        <div className="hours">{formatTimeCell(hours)}</div>
        <div className="time-divider">:</div>
        <div className="minutes">{formatTimeCell(minutes)}</div>
        <div className="time-divider">:</div>
        <div className="seconds">{formatTimeCell(seconds)}</div>
      </div>

      {/* <p>SecondsAmount: {secondsAmount}</p> */}
      {/* <p>{'Timer is ' + (timerActive ? 'ON' : 'OFF') + '.'}</p> */}

      <button type="button" onClick={toggleTimer} disabled={!secondsAmount}>{ timerActive ? 'Pause' : 'Start' }</button>
    </div>
  );
}

export default App;
