const game = document.getElementById("game");
const mushroom = document.getElementById("mushroom");
const timer = document.getElementById("time");
const message = document.getElementById("message");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const restartButton = document.getElementById("restart");
const hardModeButton = document.getElementById("hardMode");

let playerX = 365;
let playerY = 480;
let playerSpeed = 6;
let rocks = [];
let keys = {};
let gameRunning = true;
let hardMode = false;
let startTime = Date.now();
let lastRockSpawn = 0;

document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

function moveMushroom() {
    if (keys["w"]) playerY -= playerSpeed;
    if (keys["s"]) playerY += playerSpeed;
    if (keys["a"]) playerX -= playerSpeed;
    if (keys["d"]) playerX += playerSpeed;
    if (playerX < 0) playerX = 0;
    if (playerY < 0) playerY = 0;
    if (playerX > game.clientWidth - 90) playerX = game.clientWidth - 90;
    if (playerY > game.clientHeight - 90) playerY = game.clientHeight - 90;
    mushroom.style.left = playerX + "px";
    mushroom.style.top = playerY + "px";
}

function createRock() {
    const rockElement = document.createElement("img");
    rockElement.src = "rock.png";
    rockElement.className = "rock";
    const rock = {
        element: rockElement,
        x: Math.random() * (game.clientWidth - 65),
        y: -65,
        speed: 4 + Math.random() * 3
    };
    rockElement.style.left = rock.x + "px";
    rockElement.style.top = rock.y + "px";
    game.appendChild(rockElement);
    rocks.push(rock);
}

function updateRocks() {
    for (let i = rocks.length - 1; i >= 0; i--) {
        const rock = rocks[i];
        rock.y += rock.speed;
        rock.element.style.top = rock.y + "px";
        if (rock.y > game.clientHeight) {
            rock.element.remove();
            rocks.splice(i, 1);
        } else if (collision(mushroom, rock.element)) {
            loseGame();
        }
    }
}

function collision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return aRect.left < bRect.right && aRect.right > bRect.left && aRect.top < bRect.bottom && aRect.bottom > bRect.top;
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, Math.ceil(60 - elapsed));
    timer.textContent = remaining;
    if (elapsed >= 60) winGame();
}

function loseGame() {
    gameRunning = false;
    messageTitle.textContent = "Game Over!";
    messageText.textContent = "Get Lucky Next Time!";
    message.style.display = "flex";
}

function winGame() {
    gameRunning = false;
    messageTitle.textContent = "🍄 You Survived!";
    messageText.textContent = "You survived Mushroom Season!";
    message.style.display = "flex";
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    moveMushroom();
    updateRocks();
    updateTimer();
    const spawnDelay = hardMode ? 250 : 800;
    if (timestamp - lastRockSpawn > spawnDelay) {
        createRock();
        lastRockSpawn = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    rocks.forEach(function(rock) {
        rock.element.remove();
    });
    rocks = [];
    playerX = game.clientWidth / 2 - 45;
    playerY = game.clientHeight - 120;
    startTime = Date.now();
    lastRockSpawn = 0;
    gameRunning = true;
    message.style.display = "none";
    timer.textContent = "60";
    mushroom.style.left = playerX + "px";
    mushroom.style.top = playerY + "px";
    requestAnimationFrame(gameLoop);
}

hardModeButton.addEventListener("click", function() {
    hardMode = !hardMode;
    hardModeButton.textContent = hardMode ? "Hard Mode: ON" : "Hard Mode: OFF";
});

restartButton.addEventListener("click", restartGame);
playerX = game.clientWidth / 2 - 45;
playerY = game.clientHeight - 120;
mushroom.style.left = playerX + "px";
mushroom.style.top = playerY + "px";
requestAnimationFrame(gameLoop);