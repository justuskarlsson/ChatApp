var pool = require('./db')
const {Clients} = require('./session')
const {Rooms} = require('./rooms')
const {createMessages} = require('./push')


const init = async (id, data) => {
    let ws = Clients[id].ws
    let userID = Clients[id].id
    try{
      var user_rooms = await pool.query(`SELECT room_id FROM messages_room_members WHERE user_id = ${userID}`)
      // TODO: see how inner joins work with js
      rooms = []
      console.log("Room from init:", Rooms)
      for (var i = 0; i<user_rooms.length; i++) {
          var roomTitle =  await pool.query(`SELECT title FROM messages_room WHERE id = ${user_rooms[i]["room_id"]} `) 
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
    console.log(Rooms)
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



    var room = Rooms.find(room => room.id == data.roomID)

    //Send push to all clients
    var filteredUsers = room.users.filter(id => id !== userID)
    // TODO: Make safe from sql-injection (but actually is, no user provided data!)
    var pushRows = await pool.query(`SELECT id, token, user_id FROM messages_users_push WHERE user_id IN (${filteredUsers}) ` )
    console.log(pushRows)
    var tokens = pushRows.map(row => row["token"])

    Object.keys(Clients).map( async(key) =>{
      var userID = Clients[key].id
      if(room.users.includes(userID)){
        Clients[key].ws.send(JSON.stringify(res))
      }
    })

    console.log("tokens: ",tokens)
    createMessages({tokens, body: res.data.content, title:`Message from ${res.data.fromUserID}`})

    
  } catch (e){
    console.log("error message new ; ", e)
  }
}

const roomNew = async(id, data) => {
  try{
      match = false
      match_id = -1
      //console.log("Temp <length error>:", Rooms)
      for (var i=0 ; i < Rooms.length; i++) {
          var room = Rooms[i]
          _match = true
          if (room.users.length != data.roomMembers.length){
              continue
          }
          for (var j = 0; j < room.users.length; j++){
              var user = room.users[j]
              if (!data.roomMembers.includes(user)){
                  _match = false
                  break
              }
          }
          if (_match){
              match = true
              match_id = room.id
              break
          }
      }

      if(match){
          //just send a message to said room
          delete data.roomTitle
          delete data.roomMembers
          data.roomID = match_id
          messageNew(id, data)
      } else {
          roomTitle = data.roomTitle.length > 0 ? data.roomTitle : 'untitled'
          var res = pool.query(`INSERT INTO messages_room (title) VALUES (?)`, roomTitle)
          var roomID = res.insertId
          Rooms.push({
              title:roomTitle,
              id:roomID,
              users: data.roomMembers
          })

          for(var i = 0; i < data.roomMembers.length; i++){
              var _ = pool.query(`INSERT INTO messages_room_members (room_id, user_id) VALUES (?, ?)`, roomID, data.roomMembers[i])
          }

          // TODO: duplicate of new message stuff
          var userID = Clients[id].id
          var messageInsert = await pool.query(`INSERT INTO messages (content, from_user_id, room_id) 
                                                   VALUES   ("${data.content}", ${userID}, ${roomID} )`)
          var message = await pool.query(`SELECT date_sent FROM messages WHERE id = ${messageInsert.insertId}`)

          var res = {
            route: "room/new",
            data:{
              roomTitle:roomTitle,
              roomID:roomID,
              message:{
                  id:messageInsert.insertId,
                  dateSent: message[0]["date_sent"],
                  content: data.content,
                  fromUserID: userID
              }                  
            }
          }

          //Send push to all clients
          var filteredUsers = data.roomMembers.filter(id => id !== userID)
          var pushRows = await pool.query(`SELECT id, token, user_id FROM messages_users_push WHERE user_id IN (${filteredUsers}) ` )
          console.log("push tokens: ",pushRows)
          var tokens = pushRows.map(row => row["token"])

          Object.keys(Clients).map((key) =>{
            var _user = Clients[key].id
            if(data.roomMembers.includes(_user)){
              Clients[key].ws.send(JSON.stringify(res))
            }
          })
      
          console.log("tokens: ",tokens)
          createMessages({tokens, body: res.data.message.content, title:`Message from ${res.data.fromUserID}`})
      }

  } catch(e){
      console.log("Error on roomNew:", e)
  }
}


module.exports = {
    init, messageNew, roomNew
}