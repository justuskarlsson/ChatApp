import React from 'react';
import { StyleSheet,FlatList, Text, View } from 'react-native';
import {ListItem, FormInput} from 'react-native-elements'
import {NavigationActions} from 'react-navigation'
import store from '../store'
import socket from '../socket'


export default class Login extends React.Component{
    
    componentWillUnmount(){
        this._listen1.off()
    }

    constructor(props){
        super(props)
        this.state = {
            username:'',
            password:''
        }
        this._listen1 = store.on('loggedIn', (loggedIn)=>{
            if(loggedIn == 2){
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Home'})
                    ]
                })
                props.navigation.dispatch(resetAction)
            }
        })
    }

    passwordRef = {}
    usernameRef = {}

    render (){
        return(
            <View>
                <FormInput 
                    placeholder="Username"
                    ref = {(ref)=> this.usernameRef = ref}
                    onChangeText={(username)=> this.setState({username})}
                    />
                <FormInput
                    secureTextEntry
                    ref = {(ref)=> this.passwordRef = ref}
                    onChangeText={(password)=>this.setState({password})}
                    onSubmitEditing={this.login}
                    placeholder = "Password"
                    />
            </View>
        )
    }

    login = () => {
        var {username, password} = this.state
        var req = {
            route:"login/password",
            username, password
        }
        socket.send(JSON.stringify(req))
        
        this.passwordRef.clearText()
        this.setState({password:""})
        
    }
}