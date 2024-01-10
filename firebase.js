import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: "json" }; // Make sure the path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "suedespace-915d6.appspot.com"
});

const bucket = admin.storage().bucket();

// export default bucket;
export default { admin, bucket };