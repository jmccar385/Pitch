import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as querystring from 'query-string';
admin.initializeApp();

export const authSpotify = functions.https.onRequest((req, res) => {
  const redirect_uri = 'localhost:4200/signup/band';
  const state = generateRandomString(16);

  res.cookie('spotify_auth_state', state);

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: functions.config().spotify.client_id,
        scope: 'playlist-read-private',
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

function generateRandomString(length: number) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
