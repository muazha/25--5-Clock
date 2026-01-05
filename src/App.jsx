import { useState, useRef } from 'react'
import './App.css'
function App() {
  const [sessionLength, useSessionLength] = useState(25)
  const [breakLength, useBreakLength] = useState(5)

  const [timeLeft, useTimeLeft] = useState(sessionLength * 60)
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const formattedSeconds = String(seconds).padStart(2, "0")
  const formattedMinutes = String(minutes).padStart(2, "0")

  const [isRunning, setIsRunning] = useState(false)
  const [isSession, useIsSession] = useState("Session")

  const intervalRef = useRef(null)
  const isSessionRef = useRef("Session")
  const audioRef = useRef(null)


  const handlingRef = useRef(false)

  function addRemove(setter, value, delta, type) {
    if (isRunning) return

    const newValue = value + delta
    if (newValue < 1 || newValue > 60) return

    setter(newValue)
    console.log(isSessionRef.current)
    if (isSessionRef.current === type) {
      useTimeLeft(newValue * 60)
    }
  }
  function handleTimeEnd() {
    if (handlingRef.current) return
    handlingRef.current = true

    audioRef.current.play()

    if (isSessionRef.current === "Session") {
      isSessionRef.current = "Break"
      useIsSession("Break")
      useTimeLeft(breakLength * 60)
    } else {
      isSessionRef.current = "Session"
      useIsSession("Session")
      useTimeLeft(sessionLength * 60)
    }

    setTimeout(() => {
      handlingRef.current = false
    }, 50)
  }

  function toggleTimer() {
    if (isRunning) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setIsRunning(false)
      return
    }

    intervalRef.current = setInterval(() => {
      useTimeLeft(prev => {
        if (prev === 0) {
          handleTimeEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setIsRunning(true)
  }
  function reset() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
    useSessionLength(25)
    useBreakLength(5)
    useIsSession("Session")
    isSessionRef.current = "Session"
    useTimeLeft(25 * 60)
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }
  return (
    <div id="app">
      <div>
        <div className="main-title">25 + 5 Clock</div>
        <div className="length-control">
          <div id="break-label">Break Length</div>
          <button className="btn-level" id="break-decrement" value="-" onClick={() => addRemove(useBreakLength, breakLength, -1, "Break")}>
            <i className="fa fa-arrow-down fa-2x"></i>
          </button>
          <div className="btn-level" id="break-length">{breakLength}</div>
          <button className="btn-level" id="break-increment" value="+" onClick={() => addRemove(useBreakLength, breakLength, 1, "Break")}>
            <i className="fa fa-arrow-up fa-2x"></i>
          </button>
        </div>
        <div className="length-control">
          <div id="session-label">Session Length</div>
          <button className="btn-level" id="session-decrement" value="-" onClick={() => addRemove(useSessionLength, sessionLength, -1, "Session")}>
            <i className="fa fa-arrow-down fa-2x"></i>
          </button>
          <div className="btn-level" id="session-length">{sessionLength}</div>
          <button className="btn-level" id="session-increment" value="+" onClick={() => addRemove(useSessionLength, sessionLength, 1, "Session")}>
            <i className="fa fa-arrow-up fa-2x"></i>
          </button>
        </div>
        <div className="timer" style={{ color: timeLeft < 60 ? "rgb(165, 13, 13)" : "white" }}>
          <div className="timer-wrapper">
            <div id="timer-label">{isSession}</div>
            <div id="time-left">{formattedMinutes}:{formattedSeconds}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={toggleTimer}>
            <i className="fa fa-play fa-2x"></i>
            <i className="fa fa-pause fa-2x"></i>
          </button>
          <button id="reset" onClick={reset}>
            <i className="fa fa-refresh fa-2x"></i>
          </button>
        </div>
        <div className="author">
          <>Designed and Coded by </>
          <br />
          <a href="" target="_blank" rel="noreferrer">moaz</a>
        </div>
        <audio ref={audioRef} id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav">1</audio>
      </div>
    </div>
  )
}

export default App
