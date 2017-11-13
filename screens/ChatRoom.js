import React from 'react';
import { StyleSheet, Text, View, Dimensions,
         Image, TouchableHighlight, FlatList } from 'react-native';
import {List, ListItem, FormInput} from 'react-native-elements'
import socket, {store} from '../socket'


export default class ChatRoom extends React.Component{

    componentDidMount(){
        this.listRef.scrollToEnd()
    }

    componentWillUnmount(){
        this._listen1.off()
    }

    constructor(props){
        super(props)
        var {params} = this.props.navigation.state
        this.state = {
            ...params.room,
            users:params.users,
            userInfo: params.userInfo,
            newMessage: ''
        }
        // bad, really lazy, checks every room update
        this._listen1 = store.on('rooms', (rooms)=>{
            this.setState({
                room: rooms.find(room => room.id = this.id)
            })
        })
        /*
        socket.onmessage = (e) =>{
            var data = JSON.parse(e.data)
            var route = data.route
            data = data.data
            if(route == "message/new") {
                if(data.roomID == this.state.id){
                    var {id, content, fromUserID, dateSent} = data
                    var {messages} = this.state
                    this.setState({
                        messages: [...messages, {id, content, fromUserID, dateSent}]
                    })
                }
            }
        }
        */
    }
    listRef = {}



    renderMessage = ({item}) =>{
        var user = this.state.users[item.fromUserID]
        return (
            <ListItem
                onPress = {()=> this.listRef.scrollToEnd()}
                hideChevron
                roundAvatar
                avatar={{uri:user.imageURL}}
                key={item.id}
                title={item.content}
            />
        )
    }

    render(){
        const size = Dimensions.get("screen").height
        var len = this.state.messages.length
        var messages = len > 15 ? this.state.messages.slice(len-15,len) : this.state.messages
        return(
            <View style={styles.container} >
                <FlatList 
                          ref = {(ref) => this.listRef = ref}
                          data = {messages}
                          renderItem = {this.renderMessage}
                          keyExtractor={(item, index)=> item.id} />
                <FormInput style={{flex:2}} onChangeText = {this.onChangeText} />
            </View>
        )
    }

    onChangeText = (text) => {
        console.log(text)
    }
}



const styles = StyleSheet.create({
    container:{
    },
    list:{
    },
})