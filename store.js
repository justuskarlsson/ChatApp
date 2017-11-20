import {AsyncStorage} from 'react-native'
import EventStore from './event-store'
import socket from './socket'

class Store extends EventStore {

    users = []
    userInfo = {}
    rooms = []
    loggedIn = 0 // 0,1,2

    logout =  async () => {
        AsyncStorage.removeItem("token")
        var req = {
            route:"logout",
        }
        socket.send(JSON.stringify(req))
        this.update("loggedIn", 1)
    }

}

export default store = new Store("users", "userInfo", "rooms", "loggedIn")