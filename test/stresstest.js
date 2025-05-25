const { Client } = require('@stomp/stompjs');
const SockJS = require('sockjs-client');
const axios = require('axios');

// Prevent Node from blocking WebSocket
global.WebSocket = require('ws');

// === Configuration ===
const API_URL = 'https://www.chessbutbetter.com:5010/api/authentication/temp';
const WS_URL = 'https://www.chessbutbetter.com:5010/api/games';

async function getSessionId() {
    const response = await axios.post(API_URL);
    return response.data;
}

async function connectToQueue(sessionId) {
    return new Promise((resolve, reject) => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL + '/queue'),
            connectHeaders: {
                sessionID: sessionId,
                wsType: 'queue',
            },
            //debug: (msg) => console.log('[STOMP]', msg),
            onConnect: () => {
                //console.log(`[+] Connected as session ${sessionId}`);
                client.subscribe('/user/queue', (message) => {
                    const event = JSON.parse(message.body);
                    //console.log(`[${sessionId}] Event:`, event);

                    if (event.type === 'MATCH_FOUND') {
                        //console.log(`[MATCH FOUND] for session ${sessionId}`);
                        client.deactivate();
                        resolve(event.content);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame.headers['message']);
                console.error(frame.body);
                reject(new Error('STOMP error'));
            },
        });

        client.activate();
    });
}

const moves = {
    'white': ['b1c3', 'c3b1'],
    'black': ['g8f6', 'f6g8'],
}

async function playGame(sessionId, gameId, userId) {
    let counter = 0;
    let gameState;
    return new Promise((resolve, reject) => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL + '/game'),
            connectHeaders: {
                sessionID: sessionId,
                wsType: 'game',
            },
            //debug: (msg) => console.log('[STOMP]', msg),
            onConnect: () => {
                //console.log(`[+] Connected to game ${gameId} as session ${sessionId}`);
                client.subscribe(`/game/${gameId}`, async (message) => {
                    const event = JSON.parse(message.body);

                    if (event.type === 'PLAYER_JOINED') {
                        //Check if opponent joined
                        gameState = event.content.gameState;
                        if (event.content.player.id !== userId && event.content.gameState.player1.id === userId) {
                            //console.log(`[OPPONENT JOINED] for session ${sessionId}`);
                            await sendMove(client, gameState.id, { 'move': 'e2e4' });
                        }
                    } else if (event.type === 'GAME_MOVE' && (event.content.moveNumber % 2 === 1) === (gameState.player1.id === userId)) {
                        let move = moves[gameState.player1.id === userId ? 'white' : 'black'][counter % 2];
                        await sendMove(client, gameState.id, { 'move': move });
                        if (counter++ > 10) {
                            client.deactivate();
                            resolve();
                        }
                    } else if (event.type !== 'GAME_MOVE') {
                        console.log(`[${sessionId}] Event:`, event);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame.headers['message']);
                console.error(frame.body);
                reject(new Error('STOMP error'));
            },
        });

        client.activate();
    });
}

async function sendMove(client, gameId, move) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            client.publish({
                destination: `/app/game/${gameId}/move`,
                body: JSON.stringify(move),
            });
            resolve();
        }, 500);
    });
}

async function runOneClient(index) {
    try {
        const { sessionId, userId } = await getSessionId();
        console.log(`[Client ${index}] Got session ID: ${sessionId}`);
        const { id, player1, player2 } = await connectToQueue(sessionId);
        console.log(`[Client ${index}] Connected to game ${id}`);
        await playGame(sessionId, id, userId);
    } catch (err) {
        console.error(`[Client ${index}] Error:`, err);
    }
}

// === Main ===
(async () => {
    const NUM_CLIENTS = 12; // Has to be even number
    const clients = [];

    for (let i = 0; i < NUM_CLIENTS; i++) {
        clients.push(
            // Delay each client by 500ms to avoid overwhelming the server
            // and to simulate staggered connections
            //
            new Promise(resolve => setTimeout(async () => {
                await runOneClient(i);
                console.log(`[Client ${i}] Done.`);
                resolve();
            }, i * 500))
        );
    }

    await Promise.all(clients);

    console.log('✅ All clients done.');
})();
