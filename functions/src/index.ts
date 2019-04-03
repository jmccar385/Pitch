import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const createBandUser = functions.https.onCall((data, context) => {
    const uid = context.auth!.uid;
    const band = data;
    console.log(data);
    const fb = admin.firestore();
    
    return fb.collection('Artists').doc(uid).set(band).catch((err) => {
        return err;
    });
})
