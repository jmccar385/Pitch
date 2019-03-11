import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const createUser = functions.https.onRequest(async (request, response) => {
    const user = request.params('user');
    const type = request.params('type');
    const uid = request.params('uid');
    
    try {
        const res = await admin.firestore().collection(type).doc(uid).set(user);
        response.send(res);
    } catch (error) {
        response.send(error)
    }
})
