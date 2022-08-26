
const secrets = JSON.parse(process.env.secrets)
const {MongoClient} = require('mongodb')
const mongoclient = new MongoClient(secrets.mongodb);

var db = null;

export default function connectToDb() {
    return new Promise((resolve, reject) => {
        if (db) resolve(db);
        mongoclient.connect(function (err, mongoclient) {
            resolve(mongoclient.db("notation"))
        })
    })
}