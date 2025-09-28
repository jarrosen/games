const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const levelEl = document.getElementById('level');
const player1ScoreEl = document.getElementById('player1-score');
const player2ScoreEl = document.getElementById('player2-score');

let level = 1;
let player1Score = 0;
let player2Score = 0;
let levelInProgress = true;

const car1 = {
    x: 100,
    y: 500,
    width: 30,
    height: 50,
    speed: 0,
    angle: 0,
    maxSpeed: 5,
    turnSpeed: 0.1,
    acceleration: 0.2,
    deceleration: 0.1,
    color: 'blue'
};

const car2 = {
    x: 700,
    y: 500,
    width: 30,
    height: 50,
    speed: 0,
    angle: 0,
    maxSpeed: 5,
    turnSpeed: 0.1,
    acceleration: 0.2,
    deceleration: 0.1,
    color: 'red'
};

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function checkWallCollision(car) {
    const currentLevel = levels[level - 1];
    if (!currentLevel) return false;
    const map = currentLevel.map;
    const tileSize = currentLevel.tileSize;

    const centerX = car.x + car.width / 2;
    const centerY = car.y + car.height / 2;
    const angle = car.angle;

    const corners = [
        { x: -car.width / 2, y: -car.height / 2 },
        { x: car.width / 2, y: -car.height / 2 },
        { x: car.width / 2, y: car.height / 2 },
        { x: -car.width / 2, y: car.height / 2 }
    ];

    for (const corner of corners) {
        const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle) + centerX;
        const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle) + centerY;

        const col = Math.floor(rotatedX / tileSize);
        const row = Math.floor(rotatedY / tileSize);

        if (row >= 0 && row < map.length && col >= 0 && col < map[row].length && map[row][col] === 1) {
            return true;
        }
    }
    return false;
}

function updateCar(car, up, down, left, right) {
    if (keys[up] && car.speed < car.maxSpeed) {
        car.speed += car.acceleration;
    } else if (keys[down] && car.speed > -car.maxSpeed / 2) {
        car.speed -= car.acceleration;
    } else {
        if (car.speed > 0) {
            car.speed -= car.deceleration;
        } else if (car.speed < 0) {
            car.speed += car.deceleration;
        }
    }

    if (Math.abs(car.speed) < car.deceleration) {
        car.speed = 0;
    }

    if (car.speed !== 0) {
        if (keys[left]) {
            car.angle -= car.turnSpeed;
        }
        if (keys[right]) {
            car.angle += car.turnSpeed;
        }
    }

    const oldX = car.x;
    const oldY = car.y;

    car.x += car.speed * Math.sin(car.angle);
    car.y -= car.speed * Math.cos(car.angle);

    if (checkWallCollision(car)) {
        car.x = oldX;
        car.y = oldY;
        car.speed = 0;
    }

    // Boundary detection
    if (car.x < 0) car.x = 0;
    if (car.x > canvas.width - car.width) car.x = canvas.width - car.width;
    if (car.y < 0) car.y = 0;
    if (car.y > canvas.height - car.height) car.y = canvas.height - car.height;
}

const levels = [
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        tileSize: 50,
        start1: { x: 110, y: 260 },
        start2: { x: 610, y: 260 },
        finishLine: { x: 200, y: 60, width: 400, height: 10 }
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        tileSize: 50,
        start1: { x: 110, y: 260 },
        start2: { x: 610, y: 260 },
        finishLine: { x: 100, y: 60, width: 100, height: 10 }
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        tileSize: 50,
        start1: { x: 110, y: 260 },
        start2: { x: 610, y: 260 },
        finishLine: { x: 400, y: 60, width: 50, height: 10 }
    }
];

const powerUps = [];

function spawnPowerUp() {
    if (powerUps.length < 3) {
        const currentLevel = levels[level - 1];
        if (!currentLevel) return;
        const map = currentLevel.map;
        const tileSize = currentLevel.tileSize;

        let x, y;
        let valid = false;
        let attempts = 0;
        while (!valid && attempts < 100) {
            x = Math.random() * (canvas.width - 20);
            y = Math.random() * (canvas.height - 20);
            const col = Math.floor(x / tileSize);
            const row = Math.floor(y / tileSize);

            if (row >= 0 && row < map.length && col >= 0 && col < map[row].length && map[row][col] === 0) {
                valid = true;
            }
            attempts++;
        }

        if (valid) {
            powerUps.push({
                x: x,
                y: y,
                width: 20,
                height: 20,
                type: 'speed'
            });
        }
    }
}

function drawPowerUps() {
    ctx.fillStyle = 'gold';
    powerUps.forEach(powerUp => {
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
}

function checkPowerUpCollision(car) {
    powerUps.forEach((powerUp, index) => {
        if (
            car.x < powerUp.x + powerUp.width &&
            car.x + car.width > powerUp.x &&
            car.y < powerUp.y + powerUp.height &&
            car.y + car.height > powerUp.y
        ) {
            applyPowerUp(car, powerUp.type);
            powerUps.splice(index, 1);
        }
    });
}

function applyPowerUp(car, type) {
    if (type === 'speed') {
        car.maxSpeed += 2;
        setTimeout(() => {
            car.maxSpeed -= 2;
        }, 3000);
    }
}

function drawMap() {
    const currentLevel = levels[level - 1];
    for (let row = 0; row < currentLevel.map.length; row++) {
        for (let col = 0; col < currentLevel.map[row].length; col++) {
            if (currentLevel.map[row][col] === 1) {
                ctx.fillStyle = 'grey';
                ctx.fillRect(col * currentLevel.tileSize, row * currentLevel.tileSize, currentLevel.tileSize, currentLevel.tileSize);
            }
        }
    }

    // Draw finish line
    ctx.fillStyle = 'green';
    ctx.fillRect(currentLevel.finishLine.x, currentLevel.finishLine.y, currentLevel.finishLine.width, currentLevel.finishLine.height);
}

function checkLevelComplete(car, player) {
    if (!levelInProgress) return;

    const currentLevel = levels[level - 1];
    if (
        car.x < currentLevel.finishLine.x + currentLevel.finishLine.width &&
        car.x + car.width > currentLevel.finishLine.x &&
        car.y < currentLevel.finishLine.y + currentLevel.finishLine.height &&
        car.y + car.height > currentLevel.finishLine.y
    ) {
        levelInProgress = false;
        if (player === 1) {
            player1Score++;
            alert('Player 1 Wins!');
        } else {
            player2Score++;
            alert('Player 2 Wins!');
        }

        level++;
        if (level > levels.length) {
            alert('Game Over! Final Score: Player 1 - ' + player1Score + ', Player 2 - ' + player2Score);
            level = 1;
            player1Score = 0;
            player2Score = 0;
        }

        setTimeout(resetLevel, 2000);
    }
}

function resetLevel() {
    const currentLevel = levels[level - 1];
    car1.x = currentLevel.start1.x;
    car1.y = currentLevel.start1.y;
    car2.x = currentLevel.start2.x;
    car2.y = currentLevel.start2.y;
    car1.speed = 0;
    car2.speed = 0;
    car1.angle = 0;
    car2.angle = 0;
    powerUps.length = 0;
    levelInProgress = true;
}

function drawCar(car) {
    ctx.save();
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    ctx.rotate(car.angle);
    ctx.fillStyle = car.color;
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();
}

function updateUI() {
    levelEl.textContent = level;
    player1ScoreEl.textContent = player1Score;
    player2ScoreEl.textContent = player2Score;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    spawnPowerUp();
    drawPowerUps();

    updateCar(car1, 'w', 's', 'a', 'd');
    updateCar(car2, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');

    checkPowerUpCollision(car1);
    checkPowerUpCollision(car2);

    checkLevelComplete(car1, 1);
    checkLevelComplete(car2, 2);

    drawCar(car1);
    drawCar(car2);

    updateUI();
    requestAnimationFrame(gameLoop);
}

function initializeGame() {
    resetLevel();
}

// Initialize and start the game loop
initializeGame();
gameLoop();