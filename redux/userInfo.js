
export const setUserInfo = userInfo => {
    return {
        type:'SET_USER_INFO',
        userInfo
    }
}

export const userInfo = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_INFO':
            return action.userInfo
        default:
            return state
    }
}