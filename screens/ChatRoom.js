import React from 'react';
import { StyleSheet, Text, View, Dimensions,
         Image, TouchableHighlight, FlatList } from 'react-native';
import socket from '../socket'
import Store from '../store'
import {observer} from 'mobx-react'

@observer
export default class ChatRoom extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: Store.findRoom(navigation.state.params.id).title
    })

    renderMessage = ({item}) =>{
        return (
            <View>
                <Text>{item.content}</Text>
            </View>
        )
    }

    render(){
        var {params} = this.props.navigation.state
        var room = Store.findRoom(params.id)
        return(
            <View>
                <FlatList data = {room.messages}
                          renderItem = {this.renderMessage}
                          keyExtractor={(item, index)=> item.id} />
            </View>
        )
    }
}
