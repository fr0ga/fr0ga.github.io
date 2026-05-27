const WebSocket = require('ws');

// Устанавливаем порт для сервера
const PORT = 80;
const wss = new WebSocket.Server({ port: PORT });

console.log(`Сервер запущен на порту ${PORT}`);

let players = {
    green: null,
    red: null
};

// Обработчик нового подключения
wss.on('connection', (ws) => {
    console.log('Новый игрок подключился.');

    ws.on('message', (message) => {
        let data;

        // Добавление защиты при парсинге сообщений
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error('Ошибка обработки сообщения:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Неверный формат данных.' }));
            return;
        }

        // Обработка присоединения игрока
        if (data.type === 'join') {
            if (!players.green) {
                players.green = ws;
                ws.send(JSON.stringify({ type: 'assign', player: 'green' }));
                console.log('Игрок подключен как зеленый танк.');
            } else if (!players.red) {
                players.red = ws;
                ws.send(JSON.stringify({ type: 'assign', player: 'red' }));
                console.log('Игрок подключен как красный танк.');

                // Отправляем всем клиентам сообщение о начале игры
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'start', message: 'Игра началась!' }));
                    }
                });
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Игра уже заполнена.' }));
                ws.close();
                console.log('Отключен, так как места больше нет.');
            }
        }

        // Обработка движения танков
        if (data.type === 'move') {
            const updatedData = {
                type: 'update',
                player: data.player,
                x: data.x,
                y: data.y,
                angle: data.angle
            };

            // Обновление данных для всех подключённых клиентов
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(updatedData));
                }
            });
        }
    });

    ws.on('close', () => {
        // Убираем игрока из списка при отключении
        if (players.green === ws) {
            players.green = null;
            console.log('Зеленый танк отключился.');
        } else if (players.red === ws) {
            players.red = null;
            console.log('Красный танк отключился.');
        }
    });

    // Обработка ошибок соединения
    ws.on('error', (error) => {
        console.error('Ошибка соединения:', error);
    });
});