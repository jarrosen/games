const mainMenu = document.getElementById('main-menu');
const storyModeButton = document.getElementById('story-mode');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
const backgroundMusic = new Audio('common_fight.ogg');

gameCanvas.width = 800;
gameCanvas.height = 600;

const player = {
  x: 50,
  y: 50,
  width: 64,
  height: 64,
  speed: 5,
  health: 20,
  dx: 0,
  dy: 0,
  image: new Image(),
};

const fireBreath = {
  cooldown: 5000, // 5 seconds
  onCooldown: false,
  duration: 3000, // 3 seconds
  active: false,
  x: 0,
  y: 0,
  width: 50,
  height: 20,
};

const enemies = [];
let boss = null;
let gameOver = false;
let gameWon = false;

function createButcher() {
    const butcher = {
        x: Math.random() * (gameCanvas.width - 100) + 50,
        y: Math.random() * (gameCanvas.height - 100) + 50,
        width: 64,
        height: 64,
        speed: 2,
        health: 20,
        image: new Image(),
    };
    butcher.image.src = 'butcher.png';
    enemies.push(butcher);
}

function createBoss() {
    boss = {
        x: gameCanvas.width - 150,
        y: gameCanvas.height / 2 - 50,
        width: 128,
        height: 128,
        speed: 1,
        health: 50,
        image: new Image(),
    };
    boss.image.src = 'boss.svg';
}

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBoss() {
    if (boss) {
        ctx.drawImage(boss.image, boss.x, boss.y, boss.width, boss.height);
    }
}

function drawFireBreath() {
  if (fireBreath.active) {
    ctx.fillStyle = 'orange';
    fireBreath.x = player.x + player.width;
    fireBreath.y = player.y + (player.height / 2) - (fireBreath.height / 2);
    ctx.fillRect(fireBreath.x, fireBreath.y, fireBreath.width, fireBreath.height);
  }
}

function drawUI() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Health: ${player.health}`, 10, 20);

    if (fireBreath.onCooldown) {
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 30, 150, 20);
        ctx.fillStyle = 'white';
        ctx.fillText('Fire Breath CD', 15, 45);
    }
}

function drawGameOver() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', gameCanvas.width / 2 - 150, gameCanvas.height / 2 - 50);

        const buttonX = gameCanvas.width / 2 - 100;
        const buttonY = gameCanvas.height / 2;
        const buttonWidth = 200;
        const buttonHeight = 50;

        ctx.fillStyle = 'green';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Play Again', buttonX + 30, buttonY + 35);

        gameCanvas.addEventListener('click', (e) => {
            if (
                e.offsetX > buttonX &&
                e.offsetX < buttonX + buttonWidth &&
                e.offsetY > buttonY &&
                e.offsetY < buttonY + buttonHeight
            ) {
                location.reload();
            }
        });
    }
}

function drawWinScreen() {
    if (gameWon) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('You Win!', gameCanvas.width / 2 - 100, gameCanvas.height / 2 - 50);
    }
}

function clear() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;

    detectWalls();
}

function detectWalls() {
    // Left wall
    if (player.x < 0) {
        player.x = 0;
    }
    // Right wall
    if (player.x + player.width > gameCanvas.width) {
        player.x = gameCanvas.width - player.width;
    }
    // Top wall
    if (player.y < 0) {
        player.y = 0;
    }
    // Bottom wall
    if (player.y + player.height > gameCanvas.height) {
        player.y = gameCanvas.height - player.height;
    }
}

function update() {
  if (gameOver) {
    drawGameOver();
    return;
  }

  if (gameWon) {
    drawWinScreen();
    return;
  }

  clear();
  drawPlayer();
  drawEnemies();
  drawBoss();
  drawFireBreath();
  drawUI();
  newPos();
  checkCollisions();
  checkWinCondition();

  requestAnimationFrame(update);
}

function checkCollisions() {
    // Player attacks
    if (fireBreath.active) {
        enemies.forEach((enemy, index) => {
            if (
                fireBreath.x < enemy.x + enemy.width &&
                fireBreath.x + fireBreath.width > enemy.x &&
                fireBreath.y < enemy.y + enemy.height &&
                fireBreath.y + fireBreath.height > enemy.y
            ) {
                enemy.health -= 10;
                if (enemy.health <= 0) {
                    enemies.splice(index, 1);
                }
            }
        });
        if (boss &&
            fireBreath.x < boss.x + boss.width &&
            fireBreath.x + fireBreath.width > boss.x &&
            fireBreath.y < boss.y + boss.height &&
            fireBreath.y + fireBreath.height > boss.y) {
            boss.health -= 10;
        }
    }

    // Enemy attacks
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            player.health -= 5;
            if (player.health <= 0) {
                gameOver = true;
            }
        }
    });

    if (boss) {
        if (
            player.x < boss.x + boss.width &&
            player.x + player.width > boss.x &&
            player.y < boss.y + boss.height &&
            player.y + player.height > boss.y
        ) {
            player.health -= 4; // Punch damage
            if (player.health <= 0) {
                gameOver = true;
            }
        }
    }
}

function checkWinCondition() {
    if (boss && boss.health <= 0) {
        gameWon = true;
    }
}


function move(e) {
    switch(e.key) {
        case 'ArrowUp':
        case 'Up':
            player.dy = -player.speed;
            break;
        case 'ArrowDown':
        case 'Down':
            player.dy = player.speed;
            break;
        case 'ArrowLeft':
        case 'Left':
            player.dx = -player.speed;
            break;
        case 'ArrowRight':
        case 'Right':
            player.dx = player.speed;
            break;
    }
}

function stop(e) {
    switch(e.key) {
        case 'ArrowUp':
        case 'Up':
        case 'ArrowDown':
        case 'Down':
            player.dy = 0;
            break;
        case 'ArrowLeft':
        case 'Left':
        case 'ArrowRight':
        case 'Right':
            player.dx = 0;
            break;
    }
}

function attacks(e) {
    if (e.key === 'x') {
        enemies.forEach((enemy, index) => {
            if (
                player.x + player.width > enemy.x &&
                player.x < enemy.x + enemy.width &&
                player.y + player.height > enemy.y &&
                player.y < enemy.y + enemy.height
            ) {
                enemy.health -= 5;
                if (enemy.health <= 0) {
                    enemies.splice(index, 1);
                }
            }
        });
        if (boss &&
            player.x + player.width > boss.x &&
            player.x < boss.x + boss.width &&
            player.y + player.height > boss.y &&
            player.y < boss.y + boss.height) {
            boss.health -= 5;
        }
    }
    if (e.key === ' ') {
        if (!fireBreath.onCooldown) {
            fireBreath.active = true;
            fireBreath.onCooldown = true;
            setTimeout(() => {
                fireBreath.active = false;
            }, fireBreath.duration);
            setTimeout(() => {
                fireBreath.onCooldown = false;
            }, fireBreath.cooldown);
        }
    }
}

storyModeButton.addEventListener('click', () => {
  mainMenu.style.display = 'none';
  gameCanvas.style.display = 'block';
  player.image.src = 'cow_walk.png';
  for (let i = 0; i < 3; i++) {
    createButcher();
  }
  createBoss();
  backgroundMusic.loop = true;
  backgroundMusic.play();
  player.image.onload = () => {
    update();
  };
});

document.addEventListener('keydown', move);
document.addEventListener('keyup', stop);
document.addEventListener('keydown', attacks);
