import React from 'react'
import {SearchBar, FormInput, ListItem} from 'react-native-elements'
import {View, Dimensions, StyleSheet} from 'react-native'
import socket, {store} from '../socket'

export default class NewMessage extends React.Component {

    constructor(props){
        super(props)
        var {params} = this.props.navigation.state
        this.state = {
            users:store.users,
            searchText:'',
            newMessage: '',
            editing:false,
            roomMembers:[]
        }

    }

    searchRef = {}
    messageRef = {}

    getSearchedUsers = (users) => {
        var search = this.state.searchText
        console.log(search)
        var len = search.length
        var filtered = Object.values(users).filter(user =>{
            return user.displayName.slice(0,len) == search && !this.state.roomMembers.includes(user.id) 
        })
        //var filtered = Object.values(users).filter(user => user.displayName.indexOf(search) != -1 )
        return filtered.slice(0, 5)
    }


    render(){
        const size = Dimensions.get("screen")
        return(
            <View>
                <SearchBar
                    round
                    autoCapitalize="sentences"
                    ref = { (ref)=> this.searchRef = ref}
                    onChangeText={this.onSearch}
                    placeholder='Till ...' />
                <View>
                    {this.getSearchedUsers(this.state.users).map(user=>(
                    <ListItem
                        onPress = {()=>this.addMember(user.id)}
                        roundAvatar
                        avatar={{uri:user.imageURL}}
                        key={user.id}
                        title={user.displayName}
                            />
                    ))}
 
                </View>
                <FormInput  
                        placeholder = "Aa"
                        style={styles.message}
                        ref = {(ref)=> this.messageRef = ref}
                        returnKeyType="send"
                        autoCapitalize="sentences"
                        onSubmitEditing={this.onSubmit} style={{height:size.height*0.2}} 
                        onChangeText = {this.onChangeText}
                        onFocus={this.editing} onBlur={this.notEditing}/>
                
            </View>
        )
    }

    addMember = (userID) => {
        this.setState({
            roomMembers:[...this.state.roomMembers, userID]
        })
        console.log(this.state.roomMembers)
    }

    onSearch = (text) => {
        this.setState({
            searchText:text
        })
    }
    editing = () =>{
        this.setState({editing:true})
    }
    notEditing = () =>{
        this.setState({editing:false})
    }

    onChangeText = (text) => {
        this.setState({newMessage:text})
    }
    
    onSubmit = () => {
        var req = {
            route:'room/new'
        }
        req.content = this.state.newMessage
        req.fromUserID = store.userInfo.id
        req.roomTitle = ""
        var {roomMembers} = this.state
        roomMembers.push(store.userInfo.id)
        req.roomMembers = roomMembers

        console.log(req)
        
        socket.send(JSON.stringify(req))
        this.props.navigation.goBack()
    }
}

const styles = StyleSheet.create({
    message:{
        marginBottom:0,
        height:100
    }
})