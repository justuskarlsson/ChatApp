import {AsyncStorage} from 'react-native'
import store from './store'

const socket = new WebSocket("ws://192.168.0.31:8083/socket")
//

socket.onopen= async (e) => {
    try{
        var token = await AsyncStorage.getItem("token")
        if(token == null){
            return store.update("loggedIn", 1)
        }
        var req = {
            route:'login/token',
            token
        }
        store.update("token", token)
        socket.send(JSON.stringify(req))
    } catch (e){
        console.log("token init err", e)
    }
}

socket.onerror = (e) => {
    console.log(e)
}

socket.onmessage = (e) =>{
    var data = JSON.parse(e.data)
    var route = data.route
    data = data.data
    console.log(route, data)
    switch(route){
        case "message/new":
            var {id, content, fromUserID, dateSent} = data
            return store.update('rooms', 
                store.rooms.map(room => room.id == data.roomID ? 
                    {...room, messages:[ ...room.messages, {id, content, fromUserID, dateSent}]}
                    : room
                ), route, data)
        case "init":
            console.log("INIT DATA: ", data.users)
            store.update('users', data.users, route, data)
            store.update('rooms', data.rooms, route, data)
            return store.update('userInfo', data.userInfo, route, data) 
        case "room/new":
            return store.update('rooms', [...store.rooms, {
                id:data.roomID, title:data.roomTitle, messages:[data.message]
            }], route, data)
        case 'login/password':
            store.update('loggedIn',2, route, data)
            AsyncStorage.setItem("token", data.token)
            return store.update('loggedIn', 2, route, data)
        case 'login/token':
            return store.update('loggedIn', 2, route, data)
        case 'login/token/error':
            return store.update('loggedIn', 1, route, data)
        case 'login/error': 
            return console.log("generic error")
        case 'error': 
            return console.log("/error")
        default:
            return
    }   
}
//

export default socket
