import {AsyncStorage} from 'react-native'
import EventStore from './event-store'
import socket from './socket'

class Store extends EventStore {

    users = []
    userInfo = {}
    rooms = []
    loggedIn = 0 // 0,1,2
    checkedPush = false

    logout =  async () => {
        AsyncStorage.removeItem("token")
        AsyncStorage.removeItem("push-token")
        var req = {
            route:"logout",
        }
        this.update("users", [])
        this.update("users", [])
        this.update("userInfo", {})
        this.update("rooms", [])
        this.update("loggedIn", 1)
        this.update("checkedPush", false)
        socket.send(JSON.stringify(req))

    }

}

export default store = new Store("users", "userInfo", "rooms", "loggedIn", "checkedPush")