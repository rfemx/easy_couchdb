require('dotenv').config();
var util = require('util');
var CouchStorage = require('./couchstorage');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let options = {
    host: process.env.COUCHDB_HOST,
    port: process.env.COUCHDB_PORT,
    db: process.env.COUCHDB_DB,
    username: process.env.COUCHDB_USERNAME,
    password: process.env.COUCHDB_PASSWORD,
    use_https: true
}

var storage = new CouchStorage(options);

async function main() {
    try {
        util.log("get...");
        let reply1 = await storage.get("settings");
        console.log(reply1);
        var json = {
            _id: "test5",
            test: 5,
            data: { "mydata": "data is here" }
        }
        let reply2 = await storage.update(json);
        console.log(reply2);
        util.log("done.");
    } catch (err) {
        util.log("Error when loading data");
        util.log(err);
    }
}


main();


process.on('unhandledRejection', (err) => {
    util.log(err)
    process.exit(1)
})
