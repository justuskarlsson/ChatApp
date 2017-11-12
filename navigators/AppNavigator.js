import React from 'react'
import {BackButton} from 'react-native'
import { StackNavigator, addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux'
import Home from '../screens/Home'
import ChatRoom from '../screens/ChatRoom'

export const Navigator = StackNavigator({
    Home: { screen: Home },
    ChatRoom: {screen: ChatRoom}
  });
  
  
class AppNavigator extends React.Component {
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }
    componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }
    onBackPress = () => {
        const { dispatch, nav } = this.props;
        if (nav.index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    render (){
      return (
        <Navigator  navigation={addNavigationHelpers({
                    dispatch:this.props.dispatch,
                    state:this.props.nav,
                  })}/>
      )
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppNavigator)