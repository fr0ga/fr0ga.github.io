const greenTank = document.getElementById('greenTank');
const gameArea = document.querySelector('.game-area');
const applesContainer = document.getElementById('apples');
const scoreDisplay = document.getElementById('score');

let greenTankPosition = { x: 100, y: 100 };
let greenTankAngle = 0;
let greenTankScale = 1;
let score = 0;
let gameOver = false;

const keysPressed = {};

function updateTankPosition(tank, position, angle, scale) {
    tank.style.transform =
        `translate(${position.x}px, ${position.y}px) rotate(${angle}deg) scale(${scale})`;
}

// 🍎 Яблоки
function spawnApple() {
    const apple = document.createElement('div');

    apple.classList.add('apple');

    apple.style.left =
        Math.random() * (gameArea.offsetWidth - 20) + 'px';

    apple.style.top =
        Math.random() * (gameArea.offsetHeight - 20) + 'px';

    applesContainer.appendChild(apple);
}

// 🍎 Проверка столкновения
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

            spawnApple();
        }
    });
}

// 🎮 Управление
document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
});

// 🚀 Игровой цикл
function updateGame() {

    // 🛑 Остановка игры
    if (gameOver) return;

    const step = 5;
    const turnStep = 5;

    // Движение
    if (keysPressed['ArrowUp']) {
        greenTankPosition.x +=
            step * Math.cos((greenTankAngle * Math.PI) / 180);

        greenTankPosition.y +=
            step * Math.sin((greenTankAngle * Math.PI) / 180);
    }

    if (keysPressed['ArrowDown']) {
        greenTankPosition.x -=
            step * Math.cos((greenTankAngle * Math.PI) / 180);

        greenTankPosition.y -=
            step * Math.sin((greenTankAngle * Math.PI) / 180);
    }

    // Поворот
    if (keysPressed['ArrowLeft']) {
        greenTankAngle -= turnStep;
    }

    if (keysPressed['ArrowRight']) {
        greenTankAngle += turnStep;
    }

    // 📦 Ограничение движения
    const tankRect = greenTank.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    // Левая граница
    if (tankRect.left < gameRect.left) {
        greenTankPosition.x += gameRect.left - tankRect.left;
    }

    // Правая граница
    if (tankRect.right > gameRect.right) {
        greenTankPosition.x -= tankRect.right - gameRect.right;
    }

    // Верхняя граница
    if (tankRect.top < gameRect.top) {
        greenTankPosition.y += gameRect.top - tankRect.top;
    }

    // Нижняя граница
    if (tankRect.bottom > gameRect.bottom) {
        greenTankPosition.y -= tankRect.bottom - gameRect.bottom;
    }

    // Обновление позиции
    updateTankPosition(
        greenTank,
        greenTankPosition,
        greenTankAngle,
        greenTankScale
    );

    checkAppleCollision();

    // 🎉 Победа
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

        winText.style.textShadow =
            '0 0 20px #00ff00, 0 0 40px #00aa00';

        winText.style.zIndex = '9999';

        winText.style.fontFamily = 'Arial, sans-serif';

        document.body.appendChild(winText);

        return;
    }

    requestAnimationFrame(updateGame);
}

// 🚀 Запуск
updateTankPosition(
    greenTank,
    greenTankPosition,
    greenTankAngle,
    greenTankScale
);

spawnApple();
updateGame();