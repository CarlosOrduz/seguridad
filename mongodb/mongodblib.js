const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb+srv://usuario1:usuario1@petsociety-jo7y6.mongodb.net/test?retryWrites=true&w=majority';

const dbName = 'seguridad';

const client = new MongoClient(url, { useUnifiedTopology: true });

const getDatabase = (callback) => {
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        callback(db, client);
    });
}

const getAllUsers = function (db, callback) {
    const collection = db.collection('usuarios');
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}



const getUserByUsername = function (db, username, callback) {
    const collection = db.collection('usuarios');
    collection.find({ username: username}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });


}


const postUser = function (user, db, callback) {
    const collection = db.collection('usuarios');
    collection.insertOne(user).then(callback(user));
}



exports.getDatabase = getDatabase;
exports.getAllUsers = getAllUsers;

exports.getUserByUsername = getUserByUsername;

exports.postUser = postUser;


