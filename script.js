const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

const boxSize = 20;
let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 30) * boxSize, y: Math.floor(Math.random() * 30) * boxSize };
let score = 0;
let level = 1;
let speed = 150; // Initial speed in ms

// Load images
const snakeImg = new Image();
snakeImg.src = 'snake.png';  // Add your own snake image

const foodImg = new Image();
foodImg.src = 'food.png';  // Add your own food image

// Draw snake with image
function drawSnake() {
    snake.forEach(segment => ctx.drawImage(snakeImg, segment.x, segment.y, boxSize, boxSize));
}

// Draw food with image
function drawFood() {
    ctx.drawImage(foodImg, food.x, food.y, boxSize, boxSize);
}

// Move snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize };
    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score % 50 === 0) {
            levelUp(); // Increase level for every 50 points
        }
        food = { x: Math.floor(Math.random() * 30) * boxSize, y: Math.floor(Math.random() * 30) * boxSize };
        animateFood();
    } else {
        snake.pop();
    }
}

// Animation when food is eaten
function animateFood() {
    ctx.beginPath();
    ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fill();
    setTimeout(() => ctx.clearRect(food.x, food.y, boxSize, boxSize), 100); // Simple pulse effect
}

// Level up and speed increase
function levelUp() {
    level++;
    if (speed > 50) speed -= 20; // Speed up the game
}

// Check collision
function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
}

// Game loop
function gameLoop() {
    if (checkCollision()) {
        alert('Game Over! Your score is ' + score);
        saveHighScore(score);
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Level: ${level}`, 10, 50);
}

// Save high score in local storage
function saveHighScore(score) {
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        alert('New High Score: ' + score);
    }
}

// Retrieve and display high score
function getHighScore() {
    return localStorage.getItem('highScore') || 0;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (e.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (e.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (e.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

// Start the game loop
setInterval(gameLoop, speed);