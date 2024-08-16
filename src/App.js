import React, { useState, useEffect } from "react";
import "./App.css";

function GameApp() {
  const [points, setPoints] = useState("");
  const [time, setTime] = useState(0.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState([]);
  const [clickedNumbers, setClickedNumbers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  let intervalId = null;

  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setTime(0.0);
    setCountdown([]);
    setClickedNumbers({});
    setIsComplete(false);
    setGameOver(false);
    const countdownArray = [];
    for (let i = parseInt(points); i >= 1; i--) {
      countdownArray.push(i);
    }
    setCountdown(countdownArray);
  };

  const handleRestart = () => {
    setCountdown([]);
    setClickedNumbers({});
    setTime(0.0);
    setIsComplete(false);
    setGameOver(false);
    const countdownArray = [];
    for (let i = parseInt(points); i >= 1; i--) {
      countdownArray.push(i);
    }
    setCountdown(countdownArray);
  };

  const handleNumberClick = (num) => {
    if (gameOver) return;
    if (num !== Math.min(...countdown)) {
      setIsComplete(true);
      setIsPlaying(false);
      clearInterval(intervalId);
      setTime(Math.round(time * 10) / 10);
      setGameOver(true);
      setIsComplete(false);
      return;
    }

    setClickedNumbers((prevClickedNumbers) => ({
      ...prevClickedNumbers,
      [num]: true,
    }));
    setCountdown((prevCountdown) => {
      const newCountdown = prevCountdown.filter((n) => n !== num);
      if (newCountdown.length === 0) {
        setIsComplete(true);
        setGameOver(false);
        setIsPlaying(false);
        clearInterval(intervalId);
        setTime(Math.round(time * 10) / 10);
      }
      return newCountdown;
    });
  };

  useEffect(() => {
    if (isPlaying) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  const [randomPositions, setRandomPositions] = useState({});

  useEffect(() => {
    if (countdown.length > 0 && Object.keys(clickedNumbers).length === 0) {
      const randomPositions = {};
      countdown.forEach((num, index) => {
        randomPositions[num] = {
          top: Math.random() * 450,
          left: Math.random() * 450,
          zIndex: countdown.indexOf(Math.min(...countdown)),
        };
      });
      setRandomPositions(randomPositions);
    }
  }, [countdown, clickedNumbers]);

  return (
    <div className="wrap">
      <div className="content">
        {isComplete && <h2>All CLEAR!</h2>}
        {gameOver && <h2>GAME OVER!</h2>}
        <h1>LET'S PLAY</h1>
        <div className="point">
          <label>Point: </label>
          <input
            type="text"
            value={points}
            onChange={handlePointsChange}
            placeholder="Enter points"
          /> 
        </div>
        <p>Time: {time.toFixed(1)}s</p>
        {isPlaying ? (
          <button onClick={handleRestart}>Restart</button>
        ) : (
          <button onClick={handlePlay}>Play</button>
        )}
        <div className="boxNumber">
          {countdown.map((num, index) => (
            <div
              key={index}
              style={{
                top: `${randomPositions[num] ? randomPositions[num].top : 0}px`,
                left: `${
                  randomPositions[num] ? randomPositions[num].left : 0
                }px`,
                zIndex: randomPositions[num] ? randomPositions[num].zIndex : 0,
              }}
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameApp;
