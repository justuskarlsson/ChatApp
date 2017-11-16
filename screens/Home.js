import React from 'react';
import { StyleSheet, Text, View, Dimensions,
         Image, TouchableHighlight, FlatList } from 'react-native';
import {Icon, SearchBar, List, ListItem} from 'react-native-elements'
import socket, {store} from '../socket'


export default class Home extends React.Component {

  componentWillUnmount(){
    this._listen1.off()
    this._listen2.off()
  }

  constructor(props){
    super(props)
    this.state={
      rooms: store.rooms,
      users: store.users,
    }

    _listen1 = store.on('rooms',(rooms)=> this.setState({rooms}))
    _listen2 = store.on('users',(users)=> this.setState({users}))
    


  }
  
  getSortedRooms = ()=> {
    //this sirted riins'&%&

    /// sorted sorted rooms
  }

  getRoomPreview = (room)=>{
    var msg = room.messages[room.messages.length -1]
    var messageTitle = msg.content
    console.log(msg.dateSent)
    console.log(Date.parse(msg.dateSent))
    var imageURL = this.state.users[msg.fromUserID].imageURL
    return {messageTitle, imageURL}
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
 }

  // <Root />
  render() {
    return (
      <View style={styles.container}>
        <FlatList
            data={this.state.rooms}
            keyExtractor={(item, index)=>index} 
            renderItem={this.renderRoom}
        />  
      </View>
    );
  }

  roomClicked = (id) =>{
    const { navigate } = this.props.navigation;
    navigate("ChatRoom", {
      roomID:id
    })
    console.log("room :"+id+" clicked")
  }
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
