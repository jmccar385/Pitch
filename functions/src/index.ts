import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as querystring from 'query-string';
import * as request from 'request';

const stateKey = 'spotify_auth_state';
const redirect_uri = 'http://localhost:4200/signup';
const client_id = functions.config().spotify.client_id;
const client_secret = functions.config().spotify.client_secret;

admin.initializeApp();

export const lastMessageSentTrigger = functions.firestore.document('Conversations/{convoId}/Messages/{msgId}').onCreate((change, context) => {
  const msg = change.data();
  const conversationRef = admin.firestore().doc(`Conversations/${context.params.convoId}`);
  return conversationRef.update({lastMessage: msg});
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
