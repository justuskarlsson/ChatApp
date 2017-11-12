import {observable} from "mobx";



class Store {
    @observable users = new Map();
    @observable rooms = [];
    @observable userInfo = {
        displayName:'',
        username:'',
        id:0,
        imageURL:'',
        status:0
    }

    findRoom = (id)=>{
        return this.rooms.find(room => room.id == id)
    }
    initRooms = (rooms) => {
        rooms.map(room=>{
            this.rooms.push(observable(new Room(room)))
        })
    }

}

class Room {

    @observable messages = []
    @observable title = ""
    @observable id = 0

    constructor({title, id, messages}){
        this.title = title
        this.id = id
        this.messages = messages
    }

}

class Users {
}

export default new Store();