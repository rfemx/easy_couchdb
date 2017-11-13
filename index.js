require('dotenv').config();
var util = require('util');
var CouchStorage = require('./couchstorage');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var storage = new CouchStorage(
    process.env.COUCHDB_HOST,
    process.env.COUCHDB_PORT,
    process.env.COUCHDB_DB,
    process.env.COUCHDB_USERNAME,
    process.env.COUCHDB_PASSWORD,
    true
);

async function main(){
    util.log("get...");

    try{

        var json = {
            _id: "test5",
            test:5,
            data: { "mydata": "data is here" }
        }
        let replyUpdate = await storage.update(json);
        console.log(replyUpdate);
        util.log("done.");
        
    
    }catch( err ){
        util.log(err);
    }
}


main();


process.on('unhandledRejection', (err) => { 
    util.log(err)
    process.exit(1)
  })