const greenTank = document.getElementById('greenTank');
const redTank = document.getElementById('redTank');
const gameArea = document.querySelector('.game-area');

// Позиции и углы танков
let greenTankPosition = { x: 100, y: 100 };
let greenTankAngle = 0;

let redTankPosition = { x: 300, y: 300 };
let redTankAngle = 0;

const keysPressed = {};

function updateTankPosition(tank, position, angle) {
    tank.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)`;
}

// Инициализация танков
updateTankPosition(greenTank, greenTankPosition, greenTankAngle);
updateTankPosition(redTank, redTankPosition, redTankAngle);

// Обработка событий клавиш
document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
});

function updateGame() {
    const step = 5; // шаг движения
    const turnStep = 5; // шаг поворота

    // Управление зеленым танком (стрелки)
    if (keysPressed['ArrowUp']) {
        greenTankPosition.x += step * Math.cos((greenTankAngle * Math.PI) / 180);
        greenTankPosition.y += step * Math.sin((greenTankAngle * Math.PI) / 180);
    }
    if (keysPressed['ArrowDown']) {
        greenTankPosition.x -= step * Math.cos((greenTankAngle * Math.PI) / 180);
        greenTankPosition.y -= step * Math.sin((greenTankAngle * Math.PI) / 180);
    }
    if (keysPressed['ArrowLeft']) {
        greenTankAngle -= turnStep;
    }
    if (keysPressed['ArrowRight']) {
        greenTankAngle += turnStep;
    }

    // Управление красным танком (WASD)
    if (keysPressed['KeyW']) {
        redTankPosition.x += step * Math.cos((redTankAngle * Math.PI) / 180);
        redTankPosition.y += step * Math.sin((redTankAngle * Math.PI) / 180);
    }
    if (keysPressed['KeyS']) {
        redTankPosition.x -= step * Math.cos((redTankAngle * Math.PI) / 180);
        redTankPosition.y -= step * Math.sin((redTankAngle * Math.PI) / 180);
    }
    if (keysPressed['KeyA']) {
        redTankAngle -= turnStep;
    }
    if (keysPressed['KeyD']) {
        redTankAngle += turnStep;
    }

    // Ограничение движения внутри игровой области
    greenTankPosition.x = Math.max(0, Math.min(gameArea.offsetWidth - greenTank.getBoundingClientRect().width, greenTankPosition.x));
    greenTankPosition.y = Math.max(0, Math.min(gameArea.offsetHeight - greenTank.getBoundingClientRect().height, greenTankPosition.y));

    redTankPosition.x = Math.max(0, Math.min(gameArea.offsetWidth - redTank.getBoundingClientRect().width, redTankPosition.x));
    redTankPosition.y = Math.max(0, Math.min(gameArea.offsetHeight - redTank.getBoundingClientRect().height, redTankPosition.y));

    // Обновление позиций танков
    updateTankPosition(greenTank, greenTankPosition, greenTankAngle);
    updateTankPosition(redTank, redTankPosition, redTankAngle);

    requestAnimationFrame(updateGame);
}

// Запуск обновления игры
updateGame();