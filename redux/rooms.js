// Object or array??



export const setRooms = rooms => {
    return {
        type:'SET_ROOMS',
        rooms,
    }
}

export const addRoom = room => {
    return {
        type: 'ADD_ROOM',
        room,
    }
}

export const addMessage = ({message, roomID}) => {
    return {
        type: 'ADD_MESSAGE',
        message,
        roomID,
    }
}

export const rooms = (state = [], action) => {
    switch(action.type){
        case 'SET_ROOMS':
            return action.rooms
        case 'ADD_ROOM':
            return [
                ...state,
                action.room
            ]
        case 'ADD_MESSAGE':
            return state.map(room =>
                (room.id == action.roomID)
                ? {...room, messages:[...messages, action.message]}
                : room
            )
        default:
            return state
    }
}