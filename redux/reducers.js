import {users} from './users'
import {userInfo} from './userInfo'
import {rooms} from './rooms'
import {combineReducers} from 'redux'

export default combineReducers({
    users,
    userInfo,
    rooms,
})