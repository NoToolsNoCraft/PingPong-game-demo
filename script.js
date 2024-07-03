const ball = document.querySelector('.ball');
const game = document.querySelector('.game');
const paddleLeft = document.getElementById('paddleLeft');
const paddleRight = document.getElementById('paddleRight');
const leftScoreDisplay = document.getElementById('leftScore');
const rightScoreDisplay = document.getElementById('rightScore');
const timerDisplay = document.getElementById('timer');
const startMenu = document.getElementById('startMenu');
const sideSelectionMenu = document.getElementById('sideSelection');

let ballX = 400;
let ballY = 250;
let ballSpeedX = 3;
let ballSpeedY = 3;

let leftScore = 0;
let rightScore = 0;

let gameTimer = 180; // 3 minutes in seconds
let timerInterval;

let isSinglePlayer = false;
let playerSide = ''; // 'left' or 'right'

// Initialize paddle positions
paddleLeft.style.top = '200px'; // Start position for left paddle
paddleLeft.style.left = '50px'; // Initial horizontal position for left paddle
paddleRight.style.top = '200px'; // Start position for right paddle
paddleRight.style.left = '740px'; // Initial horizontal position for right paddle

// Show side selection menu for single player mode
function startSinglePlayer() {
    startMenu.style.display = 'none';
    sideSelectionMenu.style.display = 'block';
}

function startMultiplayer() {
    isSinglePlayer = false;
    startMenu.style.display = 'none';
    game.style.display = 'block';
    document.querySelector('.scoreboard').style.display = 'block';
    document.querySelector('.timer').style.display = 'block';
    startGame();
}

// Choose side for single player mode
function chooseSide(side) {
    playerSide = side;
    isSinglePlayer = true;
    sideSelectionMenu.style.display = 'none';
    game.style.display = 'block';
    document.querySelector('.scoreboard').style.display = 'block';
    document.querySelector('.timer').style.display = 'block';
    startGame();
}

// Mouse move event for left paddle control
game.addEventListener('mousemove', function(event) {
    if (isSinglePlayer && playerSide === 'left') {
        const mouseY = event.clientY - game.offsetTop;
        const mouseX = event.clientX - game.offsetLeft;
        movePaddle(paddleLeft, mouseY, mouseX, 'top', 'left');
    }
});

// Keyboard event for right paddle control
document.addEventListener('keydown', function(event) {
    const paddleTop = parseInt(paddleRight.style.top);
    const paddleLeft = parseInt(paddleRight.style.left);
    if (event.key === 'ArrowUp') {
        paddleRight.style.top = `${Math.max(paddleTop - 10, 0)}px`;
    } else if (event.key === 'ArrowDown') {
        paddleRight.style.top = `${Math.min(paddleTop + 10, 400)}px`;
    } else if (event.key === 'ArrowLeft') {
        paddleRight.style.left = `${Math.max(paddleLeft - 10, 410)}px`;
    } else if (event.key === 'ArrowRight') {
        paddleRight.style.left = `${Math.min(paddleLeft + 10, 790)}px`;
    }
});

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check collision with top and bottom walls
    if (ballY <= 0 || ballY >= 480) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(ballY, 480)); // Ensure ball stays within bounds
    }

    // Check collision with left paddle
    if (ballX <= parseInt(paddleLeft.style.left) + 20 &&
        ballX >= parseInt(paddleLeft.style.left) &&
        ballY >= parseInt(paddleLeft.style.top) &&
        ballY <= parseInt(paddleLeft.style.top) + 100) {
        ballSpeedX = Math.abs(ballSpeedX); // Ensure ballSpeedX is positive
        adjustBallSpeed(paddleLeft);
        ballX = parseInt(paddleLeft.style.left) + 20; // Move the ball away from the paddle
    }

    // Check collision with right paddle
    if (ballX >= parseInt(paddleRight.style.left) - 20 &&
        ballX <= parseInt(paddleRight.style.left) &&
        ballY >= parseInt(paddleRight.style.top) &&
        ballY <= parseInt(paddleRight.style.top) + 100) {
        ballSpeedX = -Math.abs(ballSpeedX); // Ensure ballSpeedX is negative
        adjustBallSpeed(paddleRight);
        ballX = parseInt(paddleRight.style.left) - 20; // Move the ball away from the paddle
    }

    // Check for scoring
    if (ballX <= 0) {
        rightScore++;
        resetBall();
        updateScore();
    }
    if (ballX >= 800) {
        leftScore++;
        resetBall();
        updateScore();
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

function resetBall() {
    ballX = 400;
    ballY = 250;
    ballSpeedX = 3;
    ballSpeedY = 3;
}

function updateScore() {
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;
}

function updateTimer() {
    const minutes = Math.floor(gameTimer / 60);
    let seconds = gameTimer % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `${minutes}:${seconds}`;

    if (gameTimer <= 0) {
        clearInterval(timerInterval);
        // Game over logic here
        alert("Game Over!");
    }

    gameTimer--;
}

function movePaddle(paddle, mouseY, mouseX, directionTop, directionLeft) {
    // Restrict paddle movement within its half of the table
    if (directionTop === 'top' && mouseY >= 0 && mouseY <= 400) {
        paddle.style[directionTop] = `${mouseY}px`;
    }
    if (directionLeft === 'left' && paddle === paddleLeft && mouseX >= 0 && mouseX <= 390) {
        paddle.style[directionLeft] = `${mouseX}px`;
    }
    if (directionLeft === 'left' && paddle === paddleRight && mouseX >= 410 && mouseX <= 790) {
        paddle.style[directionLeft] = `${mouseX}px`;
    }
}

function adjustBallSpeed(paddle) {
    const paddleTop = parseInt(paddle.style.top) || 200;
    const paddleCenter = paddleTop + 50; // Calculate center of the paddle

    // Calculate ball speed adjustment based on paddle position
    const relativeIntersectY = (ballY + 10) - paddleCenter;
    ballSpeedY = relativeIntersectY * 0.3;

    // Adjust ball speed based on paddle movement
    if (paddle === paddleLeft) {
        if (ballSpeedX < 0) {
            ballSpeedX += 0.5; // Increase ball speed if the paddle is moving towards the ball
        } else {
            ballSpeedX -= 0.5; // Decrease ball speed if the paddle is moving away from the ball
        }
    } else {
        if (ballSpeedX > 0) {
            ballSpeedX += 0.5; // Increase ball speed if the paddle is moving towards the ball
        } else {
            ballSpeedX -= 0.5; // Decrease ball speed if the paddle is moving away from the ball
        }
    }
}

function computerControl(paddle) {
    // Logic for computer-controlled paddle
    const paddleTop = parseInt(paddle.style.top) || 200;
    const paddleCenter = paddleTop + 50; // Calculate center of the paddle

    // Move paddle towards the ball's y position
    if (ballY < paddleCenter - 10) {
        paddle.style.top = `${Math.max(paddleTop - 3, 0)}px`;
    } else if (ballY > paddleCenter + 10) {
        paddle.style.top = `${Math.min(paddleTop + 3, 400)}px`;
    }

    // Move paddle towards the ball's x position within its half
    const paddleLeft = parseInt(paddle.style.left) || 50;
    if (ballX < paddleLeft - 10 && ballX > 400) {
        paddle.style.left = `${Math.max(paddleLeft - 3, 410)}px`;
    } else if (ballX > paddleLeft + 10 && ballX < 800) {
        paddle.style.left = `${Math.min(paddleLeft + 3, 790)}px`;
    }
}

function gameLoop() {
    updateBall();
    if (isSinglePlayer) {
        if (playerSide === 'left') {
            computerControl(paddleRight); // Computer controls the right paddle
        } else {
            computerControl(paddleLeft); // Computer controls the left paddle
        }
    }
    requestAnimationFrame(gameLoop);
}

function startGame() {
    updateScore();
    timerInterval = setInterval(updateTimer, 1000);
    gameLoop();
}
