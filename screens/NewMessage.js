import React from 'react'
import {SearchBar} from 'react-native-elements'
import {View} from 'react-native'
import socket, {store} from '../socket'

export default class NewMessage extends React.Component {

    constructor(props){
        super(props)
        var {params} = this.props.navigation.state
        this.state = {
            users:store.users,
            searchText:'',
            message: '',
            roomMembers:[]
        }

    }

    searchRef = {}

    render(){
        return(
            <View>
                <SearchBar
                    round
                    ref = { (ref)=> this.searchRef = ref}
                    onChangeText={this.onSearch}
                    placeholder='Till ...' />
            </View>
        )
    }

    onSearch = (text) => {
        this.setState({
            searchText:text
        })
    }
}