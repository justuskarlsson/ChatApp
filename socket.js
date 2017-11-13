import {EventEmitter} from 'react-native'
const socket = new WebSocket("ws://192.168.0.31:8082/chat-socket/gandalf")

class Store {


    users = {}
    userInfo = {}
    rooms = []

    // Should be in subclass
    _listeners = {
        users: {0:0},
        userInfo: {0:0},
        rooms: {0:0},
    }
    update = (key, val, route = "", args = {}) => {
        this[key] = val
        // maybe add check so that 
        if (this._listeners[key]){
            Object.values(this._listeners[key]).map( lFunc =>{
                // if lCheck => lCheck(route, args)
                lFunc(val)
            })
        }

    }

    on = (key, func) => {
        // function to check if update is valied
        // (route, args) => route == "message/new" && args.roomID == this.state.id
        this._listeners[key][0] ++
        var id = this._listeners[key][0]

        this._listeners[key][id] = lFunc
        console.log(`Listener ${id} on ${key} was added.`)
        const remove = ()=> {
            delete this._listeners[key][id]
            console.log(`Listener ${id} on ${key} was removed.`)
        }
        return {
            off : remove
        }
    }

}

export const store = new Store()

socket.onmessage = (e) =>{
    var data = JSON.parse(e.data)
    var route = data.route
    data = data.data
    if(route == "message/new") {
        var {id, content, fromUserID, dateSent} = data
        store.update('rooms', 
            store.rooms.map(room => room.id == data.roomID ? 
                {...room, messages:[ ...room.messages, {id, content, fromUserID, dateSent}]}
                : room
            )
        )
        if(data.roomID == this.state.id){
            var {id, content, fromUserID, dateSent} = data
            var {messages} = this.state
            this.setState({
                messages: [...messages, {id, content, fromUserID, dateSent}]
            })
        }
    }
}


export default socket
