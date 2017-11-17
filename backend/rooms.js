const pool = require('./db')
const {Clients} = require('./session')
let Rooms = []


const initRooms = async () => {
    try {
      var rooms = pool.query(`SELECT id, title FROM messages_room`)
      for (var i = 0; i < rooms.length; i++){
        var roomID = rooms[i].id
        var roomTitle = rooms[i].title
        var users = pool.query(`SELECT user_id FROM messages_room_members WHERE room_id = ${roomID}`)
        var _users =[]
        users.map(user => {
            var userID = user["user_id"]
            _users.push(userID)
        })
        Rooms.push({
            title:roomTitle,
            id:roomID,
            users:_users
        })
        
      }
    } catch (e) {
      console.log("initRoom", e)
    }
}


const roomNew = async(id, data) => {
    try{
        
    } catch(e){

    }
}

initRooms()

module.exports = {
    Rooms, roomNew
}
