import React from 'react';
import { StyleSheet, Text, View, Dimensions,
         Image, TouchableHighlight, FlatList } from 'react-native';
import {Icon, SearchBar, List, ListItem} from 'react-native-elements'
import socket, {store} from '../socket'


export default class Home extends React.Component {

  state = {
    rooms: [],
    userInfo: {},
    users:{},
  }
  
  onMessageNew = ({fromUserID, id, dateSent, content, roomID})=>{
    var {rooms} = this.state
    this.setState({
        rooms: rooms.map(room => 
               (room.id == roomID)
               ? {...room, messages:[...room.messages, {fromUserID, id, dateSent, content}]}
               : room
              )
    })
  }

  onInit = ({rooms, userInfo, users})=>{
    this.setState({
      rooms, userInfo, users
    })
    store.rooms = rooms
    store.userInfo = userInfo
    store.users = users

  }

  constructor(props){
    super(props)

    socket.onopen = ()=>{
    }

    socket.onmessage = (e) =>{
      var data = JSON.parse(e.data)
 
      if(data.route == "message/new") return this.onMessageNew(data.data)
      if(data.route == "init")        return this.onInit(data.data)
    }
  }  
  
  // <RoomPreview />
  renderRoom = ({item})=>{
      var room = item
      var prev = this.getRoomPreview(room)
      const onPress = () => this.roomClicked(room.id)
      return <ListItem
                roundAvatar 
                onPress={onPress}
                title = {room.title.length > 18 ? room.title.substring(0,18)+"..." : room.title}
                subtitle = {prev.messageTitle.length > 20 ? prev.messageTitle.substring(0,20)+"..." : prev.messageTitle}
                avatar={{uri:prev.imageURL}}
                key={item.id}
                />
      /*
      return (
        <RoomPreview 
            key={room.id}  
            id={room.id}
            onPress={this.roomClicked}
            messageTitle={prev.messageTitle.length > 20 ? prev.messageTitle.substring(0,20)+"..." : prev.messageTitle} 
            title={room.title.length > 18 ? room.title.substring(0,18)+"..." : room.title}
            imageURL={prev.imageURL} />
      )
      */
 }

  // <Root />
  render() {
    return (
      <View style={styles.container}>
        <FlatList
            data={this.state.rooms}
            keyExtractor={(item, index)=>item.id} 
            renderItem={this.renderRoom}
        />  
      </View>
    );
  }

  getRoomPreview = (room)=>{
    var msg = room.messages[room.messages.length -1]
    var content = msg.content
    var imageURL = this.state.users[msg.fromUserID].imageURL
    return {messageTitle:content, imageURL}
  }

  roomClicked = (id) =>{
    const { navigate } = this.props.navigation;
    navigate("ChatRoom", {
      id, 
      room: this.state.rooms.find(room => room.id == id),
      userInfo:this.state.userInfo,
      users:this.state.users
    })
    console.log("room :"+id+" clicked")
  }
}

const RoomPreview = ({onPress, id, imageURL, title, messageTitle}) =>{
    const handlePress = (e) =>{
      onPress(id)
    }
    return(
      <TouchableHighlight onPress={handlePress} style={styles.roomHighlight} >
        <View>
          <Image style={styles.roomImage} source={{uri:imageURL}} />
          <View style={styles.roomTitles}>
            <Text style={styles.roomTitle} >{title}</Text>
            <Text style={styles.roomSubtitle}>{messageTitle}</Text>
          </View>
          <View style={styles.horizontalBorder}></View>
        </View>
      </TouchableHighlight>
    )
}


const styles = StyleSheet.create({
  //GENERAL
  horizontalBorder:{
    height:1,
    width:Dimensions.get('screen').width,
    backgroundColor:'black',
    marginLeft:0,
    marginRight:0,
  },
  roomContainer:{
    flex:1,
    flexDirection:'column',
  },
  roomHighlight:{
    flex:1,
    flexDirection:'row',
  },
  roomImage:{
    flex:1,
    width: 50,
    height: 50,
    borderRadius:25,
  },
  roomTitles:{
    flex:3,
    flexDirection:'column'
  },
  roomTitle:{
    fontSize:20,
  },
  roomSubtitle:{
    fontSize:15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginLeft:5,
    marginRight:5
  },
  h2:{
    fontSize:30,
    fontWeight:'bold',
  }
});
