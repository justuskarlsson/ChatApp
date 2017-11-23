var Expo = require('expo-server-sdk');
let {Clients} = require('./session')
const pool = require('./db')

// Create a new Expo SDK client
let expo = new Expo();

// In-memory list of all token; why? -> avoid duplicate tokens for single device
const initPush = async() => {

}

const setPush = (id, data) => {
  Clients[id].pushToken = data.token
  console.log("Push token set:", data.token)
}

const registerPush = async (id, data) => {
  try {
    var {token} = data
    var userID = Clients[id].id
    Clients[id].pushToken = token
    var res = await pool.query(`INSERT INTO messages_users_push (token, user_id) VALUES (?, ? )`, [token, userID]) 
  } catch (e){
    console.log("Register push: ", e)
  }
}

const createMessages = ({tokens, body, title}) => {
  // Create the messages that you want to send to clents
  let messages = [];
  for (let pushToken of tokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    messages.push({
      to: pushToken,
      title: title,
      sound: 'default',
      body: body,
      data: { withSome: 'data' },
    })
  }

  let chunks = expo.chunkPushNotifications(messages);

  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
}

module.exports = {createMessages, registerPush, setPush}
