const express = require('express')
const app = express()
const axios = require('axios').default;

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.post('/get', async (req, res) => {
    const { doc_id } = req.body;
    const doc = await db.collection('users').doc(doc_id).get();
    res.send(doc.data());
})


app.post('/getcon', async (req, res) => {
    const { con_id ,doc_id } = req.body;
    const doc = await db.collection(con_id).doc(doc_id).get();
    res.send(doc.data());
})

app.post('/getwhere', async (req, res) => {
    const { field , value } = req.body
    const doc = await db.collection('users').where( field, '==', value).get();
    res.send(doc.docs.map(doc => doc.data()));
})

app.post('/getwherecon', async (req, res) => {
    const { con_id , field , value } = req.body
    const doc = await db.collection(con_id, '==', true).where( field, '==', value).get();
    res.send(doc.docs.map(doc => doc.data()));

})


app.post('/del', async (req, res) => {
    const { doc_id } = req.body;
    const doc = await db.collection('users').doc(doc_id).delete();
    res.send("GG_EZ");
})

app.post('/delcon', async (req, res) => {
    const { con_id, doc_id } = req.body;
    const doc = await db.collection(con_id).doc(doc_id).delete();
    res.send("GG_EZ");
})

app.post('/create', (req, res) => {
    const { name, email, password } = req.body
    const user = { name, email, password }
    db.collection('users').add(user)
        .then(doc => res.json({ message: `document ${doc.id} created successfully` }))
        .catch(err => res.status(500).json({ error: err }))
})

app.post('/createcon', (req, res) => {
    const { con_id, name, email, password } = req.body
    const user = { name, email, password }
    db.collection(con_id).add(user)
        .then(doc => res.json({ message: `document ${doc.id} created successfully` }))
        .catch(err => res.status(500).json({ error: err }))
})


app.post('/update', async (req, res) => {
    const { doc_id, name, email, password } = req.body
    let user = {name,email,password}
    await db.collection('users').doc(doc_id).update(user)
        .then(() => res.json({ message: `document ${doc_id} updated successfully` }))
        .catch(err => res.status(500).json({ error: err }))
})

app.post('/updatecon', async (req, res) => {
    const { con_id, doc_id, name, email, password } = req.body
    let user = {name,email,password}
    await db.collection(con_id).doc(doc_id).update(user)
        .then(() => res.json({ message: `document ${doc_id} updated successfully` }))
        .catch(err => res.status(500).json({ error: err }))
})



app.post('/', (req, res) => {
    let {id,name} = req.body;

    axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`).then(response => {
        if (response.status === 200) {
            res.status(200).json({
                result: response.data,
                status: response.status
            })
        } else {
            res.status(404).json({
                result: response.data,
                status: 404
            })
        }
    }).catch((error) => {
        res.status(403).json({
            message: error.message,
            status: 403
        })
    })
})

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})