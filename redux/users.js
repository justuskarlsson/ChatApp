


export const addUser = (user) =>{
    return {
        type: 'ADD_USER',
        user,
    }
}

export const setUsers = (users) => {

}



export const users = (state = {}, action) => {
    switch (action.type){
        case 'SET_USERS':
            return action.users
        case 'ADD_USER':
            return {
                ...state,
                 [action.user.id]:action.user,
            }
        default:
            return state
    }
}