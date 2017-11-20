var pool = require('./db')
const {Clients} = require('./session')
const {Rooms} = require('./rooms')


const init = async (id, data) => {
    let ws = Clients[id].ws
    let userID = Clients[id].id
    try{
      var user_rooms = await pool.query(`SELECT room_id FROM messages_room_members WHERE user_id = ${userID}`)
      // TODO: see how inner joins work with js
      rooms = []
      for (var i = 0; i<user_rooms.length; i++) {
          var roomTitle =  await pool.query(`SELECT title FROM messages_room WHERE id = ${user_rooms[i]["room_id"]} `)
          console.log(roomTitle)
          var messages = await pool.query(`SELECT * FROM messages WHERE room_id = ${user_rooms[i]["room_id"]} `)
          var _messages = []
          messages.map(message=> {
            _messages.push({
              id: message.id,
              content: message.content,
              dateSent: message["date_sent"],
              fromUserID: message["from_user_id"]
            })
          })
          rooms.push({
            id: user_rooms[i]["room_id"],
            title: roomTitle[0].title,
            messages: _messages,
          })
      }
      //debug rooms.map(room => room.messages.map(msg=> console.log(msg)))
      var users = await pool.query(`SELECT id, username, display_name, image_url FROM users`)
      var _users = []
      users.map(user=> {
        _users.push({ 
          id: user.id,
          username: user.username,
          displayName: user["display_name"],
          imageURL: user["image_url"]
        })
      })
      var userInfo = await pool.query(`SELECT id, username, display_name FROM users WHERE id = ${userID}`)
      var res = {
        route:"init",
        data:{
          rooms,
          users: _users,
          userInfo: {
            id: userInfo[0].id,
            username: userInfo[0].username,
            displayName: userInfo[0]["display_name"]
          }
        }
      }
      ws.send(JSON.stringify(res))
    } catch(e){
      console.log("error init", e)
    }
}
  
  
const messageNew = async (id, data) =>{
    try{
      var userID = Clients[id].id
      var rows = await pool.query(`INSERT INTO messages (content, from_user_id, room_id) 
                                               VALUES   ("${data.content}", ${userID}, ${data.roomID} )`)
      var message = await pool.query(`SELECT date_sent FROM messages WHERE id = ${rows.insertId}`)
      var res = {
        route: "message/new",
        data:{
          id:rows.insertId,
          dateSent: message[0]["date_sent"],
          content: data.content,
          fromUserID: userID,
          roomID: data.roomID
        }
      }
      console.log(res)
      // Wrong, only the room's clients

      // Cheat
      /*
      Object.keys(Clients).map(key =>{
        Clients[key].ws.send(JSON.stringify(res))
      })
      */
      console.log("Rooms:  ", Rooms)
      var room = Rooms.find(room => room.id == data.roomID)
      Object.keys(Clients).map(key =>{
        var userID = Clients[key].id
        if(room.users.includes(userID)){
          Clients[key].ws.send(JSON.stringify(res))
        }
      })
        

      
    } catch (e){
      console.log("error message new ; ", e)
    }
} 
  
const roomNew = async (id, data) => {
  // if room exists -> messageNew(....)
}

module.exports = {
    init, messageNew
}