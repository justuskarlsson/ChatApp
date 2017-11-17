// IOS compliant
import React from 'react';
import { StyleSheet,FlatList, Text, View, ActivityIndicator} from 'react-native';
import {ListItem, FormInput} from 'react-native-elements'
import {NavigationActions} from 'react-navigation'
import store from '../store'
import socket from '../socket'



export default class Loading extends React.Component{
    
    componentWillUnmount(){
        this._listen1.off()
    }

    constructor(props){
        super(props)
        this._listen1 = store.on('loggedIn', (loggedIn)=>{
            if(loggedIn == 1){
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Login'})
                    ]
                })
                props.navigation.dispatch(resetAction)
            }
            else if(loggedIn == 2){
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


    render (){
        return(
            <View>
                <ActivityIndicator size="large" />
            </View>
        )
    }

}