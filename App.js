import React from 'react';
import Home from './screens/Home'
import ChatRoom from './screens/ChatRoom'
import NewMessage from './screens/NewMessage'
import { StackNavigator} from 'react-navigation';
import {Icon} from 'react-native-elements'
import {store} from './socket'

const Navigator = StackNavigator({
  Home: { 
    screen: Home,
    navigationOptions:({navigation}) =>({
      title: "Chat Rooms",
      headerRight: <Icon onPress={()=>navigation.navigate("NewMessage")} name="message" 
                         color='#00aced' raised />,
      headerStyle:{
        marginTop:25
      },
    })
  },
  ChatRoom: {
    screen: ChatRoom,
    navigationOptions:({navigation}) =>({
      title: store.rooms.find(room => room.id == navigation.state.params.roomID).title,
      headerStyle:{
        marginTop:25
      },
    })
  },
  NewMessage: {
    screen: NewMessage,
    navigationOptions:({navigation}) =>({
      title: "New Message",
      headerStyle:{
        marginTop:25
      },
    })
  }
});


export default class App extends React.Component {
  render(){
    return (
        <Navigator />
    )
  }
}

