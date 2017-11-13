import React from 'react';
import { StyleSheet, Text, View, Dimensions,
         ScrollView, KeyboardAvoidingView } from 'react-native';
import {List, ListItem, FormInput} from 'react-native-elements'
import socket, {store} from '../socket'


export default class ChatRoom extends React.Component{

    componentDidMount(){
        this.listRef.scrollToEnd()
    }

    componentWillUnmount(){
        this._listen1.off()
    }

    listRef = {}
    messageRef = {}

    constructor(props){
        super(props)

        var {params} = this.props.navigation.state

        this.state = {
            room: store.rooms.find(room => room.id == params.roomID),
            users: store.users,
            userInfo: store.userInfo,
            newMessage: '',
            editing:false
        }
        setTimeout(()=> this.listRef.scrollToEnd(), 150)

        const check1 = (route, data) => route == 'message/new' && data.roomID == this.state.room.id
        const on1 = (rooms)=>{
            this.setState({
                room: rooms.find(room => room.id == this.state.room.id)
            })
            this.listRef.scrollToEnd()
        }
        this._listen1 = store.on('rooms', on1, check1)


    }

    renderMessage = (message) =>{
        var user = this.state.users[message.fromUserID]
        return (
            <ListItem
                onPress = {()=> this.listRef.scrollToEnd()}
                hideChevron
                roundAvatar
                avatar={{uri:user.imageURL}}
                key={message.id}
                title={message.content}
            />
        )
    }

    render(){
        const size = Dimensions.get("screen")
        var len = this.state.room.messages.length
        var messages = len > 15 ? this.state.room.messages.slice(len-15,len) : this.state.room.messages
        return(
            <View>
                
                <ScrollView  ref= {(ref)=> this.listRef=ref} 
                    style={{height: this.state.editing ? size.height*0.4: size.height*0.8}}>
                        {messages.map(this.renderMessage)}
                </ScrollView>
                <FormInput  
                            placeholder = "Aa"
                            ref = {(ref)=> this.messageRef = ref}
                            returnKeyType="send"
                            autoCapitalize="sentences"
                            onSubmitEditing={this.onSubmit} style={{height:size.height*0.2}} 
                            onChangeText = {this.onChangeText}
                            onFocus={this.editing} onBlur={this.notEditing}/>
            </View>
        )
    }

    editing = () =>{
        this.setState({editing:true})
        setTimeout(()=>this.listRef.scrollToEnd(),150)
    }
    notEditing = () =>{
        this.setState({editing:false})
    }

    onChangeText = (text) => {
        this.setState({newMessage:text})
    }
    
    onSubmit = () => {
        var req = {
            route:'message/new'
        }
        req.content = this.state.newMessage
        req.fromUserID = store.userInfo.id
        req.roomID = this.state.room.id
        console.log(req)
        socket.send(JSON.stringify(req))
        this.messageRef.clearText()
        this.setState({newMessage:''})
    }
}



const styles = StyleSheet.create({
    /*
    container:{
        flex:1,
        flexDirection:'column'
    },*/
    list:{
    },
})