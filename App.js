import React from 'react';
import Home from './screens/Home'
import ChatRoom from './screens/ChatRoom'
import NewMessage from './screens/NewMessage'
import Loading from './screens/Loading'
import Login from './screens/Login'
import PropTypes from 'prop-types'
import { StackNavigator} from 'react-navigation';
import {View} from 'react-native'
import {Icon} from 'react-native-elements'
import store from './store'


const Navigator = StackNavigator({
  Loading:{
    screen:Loading,
    navigationOptions:({navigation}) =>({
      title: "Loading",
      headerStyle:{
        marginTop:25
      },
    })
  },
  Login:{
    screen:Login,
    navigationOptions:({navigation}) =>({
      title: "Login",
      headerStyle:{
        marginTop:25
      },
    })
  },
  Home: { //TODO: Add logout touchable
    screen: Home,
    navigationOptions:({navigation}) =>({
      title: "Chat Rooms",
      headerRight:<View style={{flexDirection:"row"}}> 
                    <Icon
                      raised
                      name='logout'
                      type='simple-line-icon'
                      color='#f50'
                      onPress={store.logout} />
                    <Icon onPress={()=>navigation.navigate("NewMessage")} name="message" 
                         color='#00aced' raised />
                  </View>,
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

