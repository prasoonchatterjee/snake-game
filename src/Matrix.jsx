import React, { useEffect } from 'react';
import { useState } from 'react';
import { useInterval } from './useInterval';

const CANVASWIDTH = 800;
const CANVASHEIGHT = 800;
const SCALE = 50;
const SPEED = 500;

const INITIALAPPLE = [8, 4];
const INITIALSNAKE = [
  [8, 8],
  [8, 9],
  [8, 10],
];

const DIRECTIONS = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

const Matrix = () => {
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState(INITIALSNAKE);
  const [apple, setApple] = useState(INITIALAPPLE);
  const [direction, setDirection] = useState(DIRECTIONS.UP);
  const [speed, setSpeed] = useState(null);


  const checkCollision = (head, snk = snake) => {

    // check if snake head has touched canvas borders
    if (
      head[0] * SCALE >= CANVASWIDTH ||
      head[0] < 0 ||
      head[1] * SCALE >= CANVASHEIGHT ||
      head[1] < 0
    )
      return true;
      
    // check if snake has touched any segment of its body
    for (const segment of snk) {
      // console.log('1',head[0], segment[0] , head[1] , segment[1],head[0] === segment[0] && head[1] === segment[1])
      if (head[0] === segment[0] && head[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = head => {
    if (head[0] === apple[0] && head[1] === apple[1]) {
      let newApple = generateNewApple();
      if (checkCollision(newApple)) {
        newApple = generateNewApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0]+direction[0], snakeCopy[0][1]+direction[1]];
    snakeCopy.unshift(newSnakeHead)
    if(!checkAppleCollision(newSnakeHead)) snakeCopy.pop()
    if(checkCollision(newSnakeHead)) endGame()
    setSnake(snakeCopy);
  }

  const startGame = () => {
    setGameOver(false);
    setSnake(INITIALSNAKE);
    setApple(INITIALAPPLE);
    setDirection(DIRECTIONS.UP);
    setSpeed(SPEED)
  }


  const generateNewApple = () => {
    return [Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)];
  };

  useInterval(gameLoop, speed)

  const handleSnakeDirection = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        setDirection(DIRECTIONS.LEFT);
        break;
      case 'ArrowUp':
        setDirection(DIRECTIONS.UP);
        break;
      case 'ArrowRight':
        setDirection(DIRECTIONS.RIGHT);
        break;
      case 'ArrowDown':
        setDirection(DIRECTIONS.DOWN);
        break;
    }
  };

  useEffect(() => {
  
    // repaint the canvas on snake and apple state change
    const canvas = document.getElementsByTagName('canvas')[0];
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

      // draw apple
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(apple[0], apple[1], 1, 1);

      // draw snake
      ctx.fillStyle = 'pink';
      snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
    }
  }, [snake,apple]);

  return (
    <div
      style={{ margin: '10px' }}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => handleSnakeDirection(e)}
    >
      <canvas
        height={CANVASHEIGHT}
        width={CANVASWIDTH}
        style={{ border: '1px solid black' }}
      ></canvas>
      <button onClick={startGame}>Start Game</button>
      {gameOver && <p>GameOver</p>}
    </div>
  );
};

export default Matrix;
