const fbAdmin = require('firebase-admin')
const serviceAccount = require('./secret/firebase-service-key.json')

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://sprynamics.firebaseio.com',
  storageBucket: 'sprynamics.appspot.com'
})

const bucket = fbAdmin.storage().bucket()

function upload(url, destination, metadata) {
  return new Promise((resolve) => resolve())
  // return bucket.upload(url, { destination, metadata })
}

const fs = fbAdmin.firestore()

function doc(path) {
  return fs.doc(path)
}

function batch() {
  return fs.batch()
}

module.exports = {
  upload,
  bucket,
  batch,
  doc
}