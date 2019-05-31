import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as querystring from 'query-string';
import * as request from 'request';

const stateKey = 'spotify_auth_state';
const redirect_uri = 'http://localhost:4200/signup';
const client_id = functions.config().spotify.client_id;
const client_secret = functions.config().spotify.client_secret;

admin.initializeApp();

export const updateUpcomingEvents =
functions.pubsub.schedule('every 24 hours').onRun((context) => {
    return admin.firestore().collection('Venues').listDocuments().then(venueRefs => {
      venueRefs.forEach(venueRef => {
        return venueRef.collection('Events').get().then(eventsQuerySnapshot => {
          let upcomingEventCounter = 0;
          eventsQuerySnapshot.docs.forEach(eventQueryDocumentSnapshot => {
            const event = eventQueryDocumentSnapshot.data();
            if (event.EventDateTime.toDate().getTime() > Date.now()) {
              upcomingEventCounter++;
            }
          });
          return venueRef.update({upcomingEvents: upcomingEventCounter});
        });
      });
    });
})

export const lastMessageSentTrigger = functions.firestore.document('Conversations/{convoId}/Messages/{msgId}').onCreate((change, context) => {
  const msg = change.data();
  const conversationRef = admin.firestore().doc(`Conversations/${context.params.convoId}`);
  return conversationRef.update({lastMessage: msg});
})

export const newMessageNotificationTrigger = functions.firestore.document('Conversations/{convoId}/Messages/{msgId}').onCreate((change, context) => {
  const msg = change.data();
  if (!msg) return;

  const sernderUid = msg.senderId;
  const conversationRef = admin.firestore().doc(`Conversations/${context.params.convoId}`);

  return conversationRef.get().then(doc => {
    const conversation = doc.data();

    const members = conversation ? conversation.members as Array<string> : null;
    const recepientUid = members ? members.filter(uid => uid !== sernderUid) : null;

    return admin.firestore().doc(`Artists/${recepientUid}`).get().then(userDoc => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        
        const token = userData ? userData.messagingToken : null;
        const enabled = userData ? userData.messagingNotificationsEnabled : null;
        if (token && enabled) {
          const message = {
            notification: {
              title: 'New message received!',
              body: 'A venue sent you a message.'
            },
            token: token
          }

          return admin.messaging().send(message);
        } else {
          return "No token";
        }
      } else {
        return admin.firestore().doc(`Venues/${recepientUid}`).get().then(venueDoc => {
          const userData = venueDoc.data();
          
          const token = userData ? userData.messagingToken : null;
          const enabled = userData ? userData.messagingNotificationsEnabled : null;
          if (token && enabled) {
            const message = {
              notification: {
                title: 'New message received!',
                body: 'A band sent you a message.'
              },
              token: token
            }

            return admin.messaging().send(message);
          } else {
            return "No token";
          }
        });
      }
    });
  }).catch(console.log);
})

// <------------------------- Music Stuff ------------------------->
function generateRandomString(length: number) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export const refreshToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {return}
  const uid = context.auth.uid;
  const refresh_token = await admin.firestore().doc(`Artists/${uid}`).get().then(ref => {
    const userData = ref.data();
    if (!userData) {return}
    return userData.spotifyTokens.refreshToken;
  });
  const url = 'https://accounts.spotify.com/api/token';

  return new Promise((resolve, reject) => {
    request.post(url, {
      form: {
        grant_type: 'refresh_token',
        refresh_token
      },
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64')
      }
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(response);
      }
    })
  });
})

export const authSpotify = functions.https.onRequest((req, res) => {
  const state = generateRandomString(16);

  res.cookie(stateKey, state);

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: 'playlist-read-private',
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

export const callbackSpotify = functions.https.onRequest((req, res) => {
  const code = req.body.code || null;
  const state = req.body.state || null;
  // const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null) {
    // change to state === null || state !== storedState
    res.redirect(
      redirect_uri +
        '?' +
        querystring.stringify({
          error: 'state_mismatch'
        })
    );
    return;
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    };

    return new Promise((resolve, reject) => {
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    })
      .then(val => {
        res.send(val);
      })
      .catch(err => {
        res.send(err);
      });
  }
});
// <------------------------- END ------------------------->
