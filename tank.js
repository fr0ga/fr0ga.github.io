const greenTank = document.getElementById('greenTank');
const gameArea = document.querySelector('.game-area');
const applesContainer = document.getElementById('apples');
const scoreDisplay = document.getElementById('score');
const spikes = document.getElementById('spikes'); // контейнер для шипов

let greenTankPosition = { x: 100, y: 100 };
let greenTankAngle = 0;
let greenTankScale = 1;
let score = 0;
let gameOver = false;

const keysPressed = {};
let targetPoint = null;

// 📌 Обновление позиции танка
function updateTankPosition(tank, position, angle, scale) {
    tank.style.transform =
        `translate(${position.x}px, ${position.y}px) rotate(${angle}deg) scale(${scale})`;
}

// 🍎 Яблоки
function spawnApple() {
    const apple = document.createElement('div');
    apple.classList.add('apple');
    apple.style.left = Math.random() * (gameArea.offsetWidth - 20) + 'px';
    apple.style.top = '0px'; // всегда сверху
    applesContainer.appendChild(apple);
}

// 🎨 Цвета танка
const tankColors = [
    "blue", "yellow", "orange", "purple", "magenta", "cyan",
    "lime", "pink", "teal", "brown", "navy", "olive"
];
let currentColorIndex = 0;

// 🍎 Проверка столкновения танка с яблоками
function checkAppleCollision() {
    const tankRect = greenTank.getBoundingClientRect();
    const apples = document.querySelectorAll('.apple');

    apples.forEach(apple => {
        const appleRect = apple.getBoundingClientRect();
        if (
            tankRect.left < appleRect.right &&
            tankRect.right > appleRect.left &&
            tankRect.top < appleRect.bottom &&
            tankRect.bottom > appleRect.top
        ) {
            apple.remove();
            greenTankScale += 0.1;
            score++;
            scoreDisplay.textContent = "Score: " + score;

            currentColorIndex = (currentColorIndex + 1) % tankColors.length;
            const newColor = tankColors[currentColorIndex];

            greenTank.querySelectorAll("rect, circle").forEach(part => {
                const currentFill = part.getAttribute("fill");
                if (currentFill !== "black") {
                    part.setAttribute("fill", newColor);
                }
            });

            spawnApple();
        }
    });
}

// ❌ Проверка падения яблок на шипы
function checkAppleOnSpikes() {
    const spikesRect = spikes.getBoundingClientRect();
    const apples = document.querySelectorAll('.apple');

    apples.forEach(apple => {
        const appleRect = apple.getBoundingClientRect();
        if (appleRect.bottom >= spikesRect.top) {
            // Яблоко коснулось шипов → проигрыш
            gameOver = true;

            const loseText = document.createElement('div');
            loseText.textContent = 'YOU LOST THE GAME';
            loseText.style.position = 'fixed';
            loseText.style.top = '50%';
            loseText.style.left = '50%';
            loseText.style.transform = 'translate(-50%, -50%)';
            loseText.style.fontSize = '80px';
            loseText.style.fontWeight = 'bold';
            loseText.style.color = '#ff0000';
            loseText.style.textShadow = '0 0 20px #ff0000, 0 0 40px #aa0000';
            loseText.style.zIndex = '9999';
            loseText.style.fontFamily = 'Arial, sans-serif';
            document.body.appendChild(loseText);

            setTimeout(() => {
                location.reload(); // перезапуск игры через 5 сек
            }, 5000);
        }
    });
}

// 🎮 Управление клавиатурой
document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
});

// 📱 Управление на телефоне
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const gameRect = gameArea.getBoundingClientRect();

    const x = touch.clientX - gameRect.left;
    const y = touch.clientY - gameRect.top;

    targetPoint = { x, y };
});
document.addEventListener('touchend', () => {
    targetPoint = null;
});

// 🚀 Игровой цикл
function updateGame() {
    if (gameOver) return;

    const step = 5;
    const turnStep = 5;

    // --- Клавиатура ---
    if (keysPressed['ArrowUp']) {
        greenTankPosition.x += step * Math.cos((greenTankAngle * Math.PI) / 180);
        greenTankPosition.y += step * Math.sin((greenTankAngle * Math.PI) / 180);
    }
    if (keysPressed['ArrowDown']) {
        greenTankPosition.x -= step * Math.cos((greenTankAngle * Math.PI) / 180);
        greenTankPosition.y -= step * Math.sin((greenTankAngle * Math.PI) / 180);
    }
    if (keysPressed['ArrowLeft']) greenTankAngle -= turnStep;
    if (keysPressed['ArrowRight']) greenTankAngle += turnStep;

    // --- Телефон ---
    if (targetPoint) {
        const dx = targetPoint.x - greenTankPosition.x;
        const dy = targetPoint.y - greenTankPosition.y;

        const angleToTarget = Math.atan2(dy, dx) * 180 / Math.PI;
        let angleDiff = angleToTarget - greenTankAngle;
        angleDiff = ((angleDiff + 180) % 360) - 180;
        greenTankAngle += angleDiff * 0.1;

        greenTankPosition.x += step * Math.cos((greenTankAngle * Math.PI) / 180);
        greenTankPosition.y += step * Math.sin((greenTankAngle * Math.PI) / 180);

        if (Math.hypot(dx, dy) < 10) {
            targetPoint = null;
        }
    }

    // 📦 Ограничение движения
    const tankRect = greenTank.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    if (tankRect.left < gameRect.left) {
        greenTankPosition.x += gameRect.left - tankRect.left;
    }
    if (tankRect.right > gameRect.right) {
        greenTankPosition.x -= tankRect.right - gameRect.right;
    }
    if (tankRect.top < gameRect.top) {
        greenTankPosition.y += gameRect.top - tankRect.top;
    }
    if (tankRect.bottom > gameRect.bottom) {
        greenTankPosition.y -= tankRect.bottom - gameRect.bottom;
    }

    // 📉 Падение яблок
    const apples = document.querySelectorAll('.apple');
    apples.forEach(apple => {
        let top = parseFloat(apple.style.top);
        apple.style.top = (top + 2) + "px"; // скорость падения
    });

    updateTankPosition(greenTank, greenTankPosition, greenTankAngle, greenTankScale);
    checkAppleCollision();
    checkAppleOnSpikes();

    // 🎉 Победа (код не меняем)
    if (score >= 400) {
        gameOver = true;
        const winText = document.createElement('div');
        winText.textContent = 'YOU PASSED THE GAME!';
        winText.style.position = 'fixed';
        winText.style.top = '50%';
        winText.style.left = '50%';
        winText.style.transform = 'translate(-50%, -50%)';
        winText.style.fontSize = '80px';
        winText.style.fontWeight = 'bold';
        winText.style.color = '#00ff00';
        winText.style.textShadow = '0 0 20px #00ff00, 0 0 40px #00aa00';
        winText.style.zIndex = '9999';
        winText.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(winText);
        return;
    }

    requestAnimationFrame(updateGame);
}

// 🚀 Запуск
updateTankPosition(greenTank, greenTankPosition, greenTankAngle, greenTankScale);
spawnApple();
updateGame();
