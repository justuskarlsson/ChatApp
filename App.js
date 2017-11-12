import React from 'react';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducers from './redux/reducers'

import AppNavigator from './navigators/AppNavigator'





export default class App extends React.Component {
  store = createStore(reducers);
  render(){
    return (
      <Provider store={this.store}>
        <AppNavigator />
      </Provider>
    )
  }
}

