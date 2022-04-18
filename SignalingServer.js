import { WebSocketServer } from 'ws';
const peers = {};
const wss = new WebSocketServer();
let sender, receiver;
wss.on('connection', (ws) => {
    console.log('on connection');
    ws.on('message', (data) => {
        console.log(data.toString());
        const msg = JSON.parse(data);
        console.log(msg.src, msg.peerType, msg.type);
        if (msg.type === 'new') {
            ws.peerType = msg.peerType;
            if (msg.peerType === 'sender') {
                sender = ws;
            }
            else {
                receiver = ws;
            }
        }
        if (ws.peerType === 'receiver') {
            sender.send(JSON.stringify(msg));
        }
        else {
            receiver?.send(JSON.stringify(msg));
        }
    });
    ws.on('close', ws => {
        if (peers[ws.peerId]) {
            delete peers[ws.peerId];
        }
    });
});