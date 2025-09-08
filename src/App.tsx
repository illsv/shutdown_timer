import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api'
import './App.css'

enum timerModes {
  SLEEP = 'sleep',
  REBOOT = 'reboot',
  SHUTDOWN = 'shutdown',
}

function App() {
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [secondsAmount, setSecondsAmount] = useState<number>(0)
  const [selectedMode, setSelectedMode] = useState<string>(timerModes.SHUTDOWN)
  const [displayPCOnly, setDisplayPCOnly] = useState<boolean>(true)

  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)

  useEffect(() => {
    if (timerActive && secondsAmount === 0) executeShutdown()
    if (!secondsAmount) return
    if (!timerActive) return

    const interval = setInterval(() => {
      const seconds = secondsAmount - 1
      setSecondsAmount(seconds)
      setReturnValues(seconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsAmount, timerActive])

  const toggleTimer = () => {
    setTimerActive(!timerActive)
  }

  const addMinutesToTimer = (amount: number) => {
    const seconds = secondsAmount + amount * 60
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
  }

  const formatTimeCell = (val: number) => {
    let str: string = val.toString()
    if (str.length >= 2) return val
    if (str.length == 1) return '0' + val
    return '00'
  }

  const executeShutdown = async () => {
    await invoke('shutdown_action', {
      mode: selectedMode,
      pcOnly: displayPCOnly,
    })
  }

  return (
    <div className="container">
      <div className="countdown">
        <div className="time hours">{formatTimeCell(hours)}</div>
        <div className="time-divider">:</div>
        <div className="time minutes">{formatTimeCell(minutes)}</div>
        <div className="time-divider">:</div>
        <div className="time seconds">{formatTimeCell(seconds)}</div>
      </div>

      <form>
        <div className="mode-selection-row">
          {/* <label htmlFor="shutdown-opt">Mode:</label> */}
          <select
            name="shutdown-mode"
            id="shutdown-opt"
            onChange={(e) => setSelectedMode(e.target.value)}
            value={selectedMode}
          >
            <option value={timerModes.SHUTDOWN}>Shutdown</option>
            <option value={timerModes.REBOOT}>Reboot</option>
            <option value={timerModes.SLEEP}>Sleep</option>
          </select>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            Change display to <b>PC only</b>?
            <input
              type="checkbox"
              name="display-pc-only"
              id="display-checkbox"
              checked={displayPCOnly}
              onChange={(e) => setDisplayPCOnly(e.target.checked)}
            />
          </label>
        </div>

        <hr />

        <div className="minutes-row">
          <button
            className="button"
            type="button"
            onClick={() => {
              addMinutesToTimer(5)
            }}
          >
            +5
          </button>
          <button
            className="button"
            type="button"
            onClick={() => {
              addMinutesToTimer(10)
            }}
          >
            +10
          </button>
          <button
            className="button"
            type="button"
            onClick={() => {
              addMinutesToTimer(30)
            }}
          >
            +30
          </button>
          <button
            className="button"
            type="button"
            onClick={() => {
              addMinutesToTimer(60)
            }}
          >
            +60
          </button>
          <button
            className="button"
            type="button"
            onClick={() => {
              addMinutesToTimer(120)
            }}
          >
            +120
          </button>
        </div>

        <hr></hr>
        <div className="controls-row">
          <button
            id="cancel-button"
            className="button"
            type="button"
            onClick={clearTimerMinutes}
          >
            Clear
          </button>

          <hr className="button-splitter"></hr>

          <button
            id="toggle-button"
            className="button"
            type="button"
            onClick={toggleTimer}
            disabled={!secondsAmount}
          >
            {timerActive ? 'Pause' : 'Start'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
