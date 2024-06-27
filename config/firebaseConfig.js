const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccountPath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://prostopoo-cb3a5.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = bucket;
