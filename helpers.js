import { Permissions, Notifications } from 'expo';
import {AsyncStorage} from 'react-native'
import socket from './socket'
import store from './store'



export const registerForPushNotificationsAsync =  async () => {

  const Done = () => store.update('checkedPush', true)

  let oldToken = await AsyncStorage.getItem("push-token")
  if (oldToken !== null){
    var req = {
      route:"push/token",
      token:oldToken,
    }
    socket.send(JSON.stringify(req))
    return Done()
  }  

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return Done();
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  let res0 = await AsyncStorage.setItem("push-token", token)

  var req = {
    route:"push/register",
    token,
  }
  socket.send(JSON.stringify(req))
  
  return Done()
}