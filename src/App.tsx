import { useState } from "react";
import "./App.css";

function App() {
  const [ minutesAmount, setMinutesAmount ] = useState<number>(0);
  const [ timerActive, setTimerActive ] = useState<boolean>(false);

  const toggleTimer = () => {
    setTimerActive(!timerActive)
  }

  const addTimerMinutes = (amount: number) => {
    setMinutesAmount(minutesAmount + amount)
  }

  const clearTimerMinutes = () => {
    setTimerActive(false)
    setMinutesAmount(0)
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
          <button type="button" onClick={ () => {addTimerMinutes(5)} }>5</button>
          <button type="button" onClick={ () => {addTimerMinutes(10)} }>10</button>
          <button type="button" onClick={ () => {addTimerMinutes(30)} }>30</button>
          <button type="button" onClick={ () => {addTimerMinutes(60)} }>60</button>
          <button type="button" onClick={ () => {addTimerMinutes(120)} }>120</button>
        </div>

        <button type="button" id='clear-timer' onClick={clearTimerMinutes}>Clear</button>
      </form>

    <p>Timer Minutes: {minutesAmount}</p>
    <p>{'Timer is ' + (timerActive ? 'ON' : 'OFF') + '.'}</p>

    <button type="button" id='toggle-timer' onClick={toggleTimer}>{ timerActive ? 'Pause' : 'Start' }</button>
    </div>
  );
}

export default App;
