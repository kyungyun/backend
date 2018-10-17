const createNewBlock = require("./public/blockchain").createNewBlock;

/*
/////////////////////////////// socket방식 ///////////////////////////////////////////////////////////////////////////////////////
module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

    io.on('connection', (socket)=> {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        socket.on('disconnection', ()=> {
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error)=> {
            console.error(error);
        });
        socket.on('reply', (data)=> {
            console.log(data);
        });
        socket.interval = setInterval(()=> {
            socket.emit('news', 'Hello Socket.IO');
        }, 3000);
    });
};
*/

/////////////////////// ws방식 //////////////////////////////////////////////////////////////////////////////////////////////////////

const WebSocket = require('ws');

module.exports = (server)=> {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req)=> {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트의 IP를 알아내는 유명한 방법 중 하나
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (data)=> {
            data = JSON.parse(data);
            if(data.func === "GET_NEWBLOCK") {
                ws.send(JSON.stringify({func:"GET_NEWBLOCK", data: createNewBlock(data.message)}));
            }

        });
        ws.on('error', (error)=> {
            console.log(error);
        });
        ws.on('close', ()=> {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });
    });
};

/*
///////////////////////////////////// ws방식 index.pug //////////////////////////////////////////////////////////////////////////
doctype
html
    head
        meta(charset='utf8')
        title GIF 채팅방
    body
        div F12를 눌러 console 탭과 network 탭을 확인하세요.
        script.
            var webSocket = new WebSocket("ws://localhost:8005");
            webSocket.onopen = function() {
                console.log('서버와 웹 소켓 연결 성공!');
            }
            webSocket.onmessage = function(event) {
                console.log(event.data);
                webSocket.send('클라이언트에서 서버로 답장을 보냅니다.');
            }
*/