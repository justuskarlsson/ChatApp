// IT FUCKING WORKS BRAAAHHY

const WebSocket = require('ws');
const {Rooms} = require('./rooms')
const {loginPassword, loginToken, register, logout} = require('./auth')
const {messageNew, init, roomNew} = require('./chat')
let {Clients, clientsID} = require('./session')
const {registerPush, setPush} = require('./push')


const wss = new WebSocket.Server({ port: 8083 });


// setInterval(()=>{console.log(Rooms)},500)


wss.on('connection', function connection(ws) {
    var id = clientsID
    Clients[id] = {
      ws,
      auth:false,
      id:-1,
      token:"",
      pushToken:""
    }
    clientsID ++
    ws.on('message', function incoming(data) {
      var data = JSON.parse(data)
      console.log(data)
      switch(data.route){
        case 'login/password': return loginPassword(id, data)
        case 'login/token': return loginToken(id, data)
        case 'logout': return logout(id, data)
        case 'register': return register(id, data)
        case 'init': return init(id, data)
        case 'message/new': return messageNew(id, data)
        case 'room/new': return roomNew(id, data)
        case 'push/register': return registerPush(id, data)
        case 'push/token': return setPush(id, data)
      }
    });
    ws.on('close', ()=>{
      console.log("Client disconnected id:", id)
      delete Clients[id]
    }) 
});

