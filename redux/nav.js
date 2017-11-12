
import { NavigationActions } from 'react-navigation';

import {Navigator} from '../navigators/AppNavigator';




const firstAction = AppNavigator.router.getActionForPathAndParams('Home');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('ChatRoom');

const initialState = AppNavigator.router.getStateForAction(
    secondAction,
    {
        ...tempNavState,
        index:0,
    }
  );

export const nav = (state = initialState, action) => {
    let nextState;
    switch (action.type) {
      case 'ChatRoom':
        nextState = AppNavigator.router.getStateForAction(
          NavigationActions.back(),
          state
        );
        break;
     /*
      case 'Logout':
        nextState = AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Login' }),
          state
        );
        break;
    */
      default:
        nextState = AppNavigator.router.getStateForAction(action, state);
        break;
    }
  
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
  }