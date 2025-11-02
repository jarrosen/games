const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const levelEl = document.getElementById('level');
const timerEl = document.getElementById('timer');
const collectedCountEl = document.getElementById('collected-count');
const totalCollectiblesEl = document.getElementById('total-collectibles');
const highScoresContainer = document.getElementById('high-scores-container');
const highScoresLevelEl = document.getElementById('high-scores-level');
const highScoresListEl = document.getElementById('high-scores-list');

let level = 1;
let highScores = {};
const MAX_HIGH_SCORES = 5;
let timeLeft = 60;
let timerInterval = null;
let collectedCount = 0;
let levelInProgress = false;
let countdown = 3;
let countdownInProgress = true;

const car1 = {
    x: 100,
    y: 500,
    width: 38,
    height: 82,
    speed: 0,
    angle: 0,
    maxSpeed: 5,
    turnSpeed: 0.1,
    acceleration: 0.2,
    deceleration: 0.1,
    color: 'blue'
};

const assets = {
    car1: null,
    track: null,
    wall: null
};

const assetPaths = {
    car1: 'assets/car_blue_3.png',
    track: 'assets/land_sand01.png',
    wall: 'assets/barrier_red.png'
};

function loadAssets(callback) {
    let assetsLoaded = 0;
    const numAssets = Object.keys(assetPaths).length;

    for (const key in assetPaths) {
        assets[key] = new Image();
        assets[key].src = assetPaths[key];
        assets[key].onload = () => {
            assetsLoaded++;
            if (assetsLoaded === numAssets) {
                callback();
            }
        };
    }
}

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
    if (countdownInProgress) {
        car.speed = 0;
        return;
    }
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
        timeLimit: 45,
        collectibles: [
            { x: 400, y: 100 },
            { x: 700, y: 200 },
            { x: 700, y: 400 },
            { x: 100, y: 400 },
            { x: 100, y: 200 }
        ]
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
        timeLimit: 50,
        collectibles: [
            { x: 150, y: 100 },
            { x: 400, y: 100 },
            { x: 700, y: 250 },
            { x: 700, y: 450 },
            { x: 100, y: 450 },
            { x: 100, y: 250 }
        ]
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
        timeLimit: 60,
        collectibles: [
            { x: 425, y: 100 },
            { x: 700, y: 100 },
            { x: 700, y: 500 },
            { x: 100, y: 500 },
            { x: 100, y: 100 }
        ]
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        tileSize: 50,
        start1: { x: 75, y: 275 },
        timeLimit: 55,
        collectibles: [
            { x: 200, y: 100 },
            { x: 400, y: 200 },
            { x: 600, y: 100 },
            { x: 600, y: 400 },
            { x: 200, y: 400 }
        ]
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        tileSize: 50,
        start1: { x: 225, y: 175 },
        timeLimit: 65,
        collectibles: [
            { x: 100, y: 100 },
            { x: 700, y: 100 },
            { x: 100, y: 500 },
            { x: 700, y: 500 },
            { x: 400, y: 300 }
        ]
    }
];

const collectibles = [];

function drawCollectibles() {
    ctx.fillStyle = 'gold';
    collectibles.forEach(collectible => {
        ctx.save();
        ctx.translate(collectible.x, collectible.y);
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(20, 20);
        ctx.lineTo(0, 20);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    });
}

function checkCollectibleCollision(car) {
    collectibles.forEach((collectible, index) => {
        const collectibleSize = 20;
        if (
            car.x < collectible.x + collectibleSize &&
            car.x + car.width > collectible.x &&
            car.y < collectible.y + collectibleSize &&
            car.y + car.height > collectible.y
        ) {
            collectibles.splice(index, 1);
            collectedCount++;
        }
    });
}

function drawMap() {
    const currentLevel = levels[level - 1];
    if (assets.track) {
        ctx.fillStyle = ctx.createPattern(assets.track, 'repeat');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    for (let row = 0; row < currentLevel.map.length; row++) {
        for (let col = 0; col < currentLevel.map[row].length; col++) {
            if (currentLevel.map[row][col] === 1) {
                if (assets.wall) {
                    ctx.drawImage(assets.wall, col * currentLevel.tileSize, row * currentLevel.tileSize, currentLevel.tileSize, currentLevel.tileSize);
                } else {
                    ctx.fillStyle = 'grey';
                    ctx.fillRect(col * currentLevel.tileSize, row * currentLevel.tileSize, currentLevel.tileSize, currentLevel.tileSize);
                }
            }
        }
    }

}

function loadHighScores() {
    const scores = localStorage.getItem('highScores');
    if (scores) {
        highScores = JSON.parse(scores);
    } else {
        // Initialize with empty scores for each map
        for (let i = 1; i <= levels.length; i++) {
            highScores[`map_${i}`] = [];
        }
    }
}

function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function isHighScore(score) {
    const mapScores = highScores[`map_${level}`] || [];
    if (mapScores.length < MAX_HIGH_SCORES) {
        return true;
    }
    // Scores are remaining time, so higher is better
    return score > mapScores[mapScores.length - 1].score;
}

function addHighScore(name, score) {
    const mapScores = highScores[`map_${level}`] || [];
    mapScores.push({ name, score });
    // Higher scores (more time left) are better
    mapScores.sort((a, b) => b.score - a.score);
    highScores[`map_${level}`] = mapScores.slice(0, MAX_HIGH_SCORES);
    saveHighScores();
    displayHighScores();
}

function displayHighScores() {
    const mapScores = highScores[`map_${level}`] || [];
    highScoresLevelEl.textContent = level;
    highScoresListEl.innerHTML = '';

    if (mapScores.length === 0) {
        highScoresListEl.innerHTML = '<li>No scores yet!</li>';
    } else {
        mapScores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.score}`;
            highScoresListEl.appendChild(li);
        });
    }
    highScoresContainer.style.display = 'block';
}

function checkGameOver() {
    if (!levelInProgress) return;

    const currentLevel = levels[level - 1];
    const allCollected = collectedCount === currentLevel.collectibles.length;

    if (allCollected) {
        levelInProgress = false;
        clearInterval(timerInterval);
        const score = timeLeft;

        if (isHighScore(score)) {
            const name = prompt(`New High Score! Enter your name:`);
            if (name) {
                addHighScore(name, score);
            }
        } else {
            alert('You Win!');
        }

        level++;
        if (level > levels.length) {
            alert('Congratulations! You beat the game!');
            level = 1;
        }
        setTimeout(resetLevel, 2000);
    } else if (timeLeft <= 0) {
        levelInProgress = false;
        clearInterval(timerInterval);
        alert('Game Over: Time is up!');
        setTimeout(resetLevel, 2000);
    }
}

function startCountdown() {
    countdownInProgress = true;
    countdown = 3;
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownInProgress = false;
            levelInProgress = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    timeLeft = 0;
                    clearInterval(timerInterval);
                }
            }, 1000);
        }
    }, 1000);
}

function drawCountdown() {
    if (countdownInProgress) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff0';
        ctx.font = '100px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let text = countdown > 0 ? countdown : 'Go!';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
}

function resetLevel() {
    highScoresContainer.style.display = 'none';
    const currentLevel = levels[level - 1];
    car1.x = currentLevel.start1.x;
    car1.y = currentLevel.start1.y;
    car1.speed = 0;
    car1.angle = 0;

    collectedCount = 0;
    collectibles.length = 0;
    for (const item of currentLevel.collectibles) {
        collectibles.push({ ...item });
    }

    timeLeft = currentLevel.timeLimit;
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    levelInProgress = false;
    startCountdown();
    displayHighScores();
}

function drawCar(car) {
    ctx.save();
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    ctx.rotate(car.angle);
    const carAsset = assets.car1;
    if (carAsset) {
        ctx.drawImage(carAsset, -car.width / 2, -car.height / 2, car.width, car.height);
    } else {
        ctx.fillStyle = car.color;
        ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    }
    ctx.restore();
}

function updateUI() {
    const currentLevel = levels[level - 1];
    levelEl.textContent = level;
    timerEl.textContent = timeLeft;
    collectedCountEl.textContent = collectedCount;
    totalCollectiblesEl.textContent = currentLevel.collectibles.length;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawCollectibles();

    updateCar(car1, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');

    checkCollectibleCollision(car1);
    checkGameOver();

    drawCar(car1);

    drawCountdown();

    updateUI();
    requestAnimationFrame(gameLoop);
}

function initializeGame() {
    loadHighScores();
    loadAssets(() => {
        resetLevel();
        gameLoop();
    });
}

// Initialize and start the game loop
initializeGame();