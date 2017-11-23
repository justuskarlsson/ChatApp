const pool = require('./db')
var crypto = require('crypto')
const {Clients} = require('./session')
const {init} = require('./chat')
const {Rooms} = require('./rooms')

const logout = async (id, data) => {
    try{
      var rows = await pool.query(`DELETE FROM user_sessions WHERE token = "${Clients[id].token}" `)
      if(Clients[id].pushToken.length > 0){
        var _ = await pool.query(`DELETE FROM messages_users_push WHERE token = ? `, Clients[id].pushToken)
        console.log("Push token removed")
      }
      Clients[id].auth = false
      Clients[id].token = ""
      Clients[id].id = -1
    } catch (e){
  
    }
}
// Not ready
const register = async (id, data) => {
    try {
      let ws = Clients[id].ws
      var res = await pool.query(`INSERT INTO users (username, password) VALUES ("${data.username}", "${data.password}") `)
      var userID = res.insertId
      console.log(res)
      crypto.randomBytes(64, async(err, buf)=>{
        try{
          var token = buf.toString("hex")
          var res = await pool.query(`INSERT INTO user_sessions (token, user_id) VALUES ("${token}", ${userID})`)
          Clients[id].auth = true
          Clients[id].id = userID
          Clients[id].token = token
          var req = {
            route :"login/password",
            data:{
              token
            }
          }
          ws.send(JSON.stringify(req))
          init(id, data)
        } catch(e){ 
          console.log("Inser token err: ", e)
        }
      })
    } catch (e){
      console.log("Register", e)
    }
}


const loginToken = async (id, data) => {
    try {
      let ws = Clients[id].ws
      var rows = await pool.query(`SELECT user_id FROM users_sessions WHERE token = "${data.token}" `)
      // if token exists
      console.log(rows)
      if(!rows[0]){
        console.log("Error on token")
        ws.send(JSON.stringify({route:"login/token/error", data:{error:"Token does not exist"}}))
      } else {
        var userInfo = await pool.query(`SELECT display_name, id, username, image_url FROM users WHERE id = ${rows[0]["user_id"]}`)
        var _userInfo = {
          id: userInfo[0].id,
          displayName: userInfo[0]["display_name"],
          username: userInfo[0].username,
          imageURL : userInfo[0]["image_url"]
        }
        Clients[id].auth = true
        Clients[id].id = rows[0]["user_id"]
        Clients[id].token = data.token
        console.log("Userinfo : ", userInfo[0])
        ws.send(JSON.stringify({route:"login/token", userInfo:_userInfo}))
        init(id, data)
      }
  
    } catch (e){
      console.log("Error loginToken", e)
      //send back error
    }
}
  
  
const loginPassword = async (id, data) => {
    try{
      let ws = Clients[id].ws
      var res = await pool.query(`SELECT id, password FROM users WHERE username = "${data.username}" `)
      if (res[0] == null){
        console.log("No user match",data)
        return ws.send(JSON.stringify({route:"error", error:"NO results"}))
      }
      var {password} = res[0]
      var userID = res[0].id
  
      if (password != data.password){
        // send back error failed message
        console.log("No password match",data)
        return ws.send(JSON.stringify({route:"error", error:"Password did not match"}))
      }
      crypto.randomBytes(64, async(err, buf)=>{
        var token = buf.toString("hex")
        var res = await pool.query(`INSERT INTO users_sessions (token, user_id) VALUES ("${token}", ${userID})`)
        Clients[id].auth = true
        Clients[id].id = userID
        Clients[id].token = token
        var req = {
          route :"login/password",
          data:{
            token
          }
        }
        ws.send(JSON.stringify(req))
        init(id, data)
      })
    } catch (e){
      console.log("error on login:", e)
    }
}
  
  module.exports = {
      logout, loginPassword, loginToken, register
  }