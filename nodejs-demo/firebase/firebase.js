var admin = require("firebase-admin");

var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const database = admin.firestore();
getFirebase()


// อ่านข้อมูลของ firebase ตามชื่อ Collection
async function getFirebase() {
  const snapshot = await database.collection('oxen-reward').get()
  console.log(snapshot);
  return snapshot.docs.map(doc => doc.id);
}
module.exports = { database, getFirebase };



