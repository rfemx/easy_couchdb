# easy_couchdb


- simple couchdb client 

- parameters are set in .env file (see .sample-env)


COUCHDB_HOST=<hostname>
COUCHDB_PORT=<port>
COUCHDB_DB=<database>
COUCHDB_USER=<username>
COUCHDB_PASSWORD=<password>


- functions 
    get doc by id
    update doc by id



Sample:


var storage = new CouchStorage(
    process.env.COUCHDB_HOST,
    process.env.COUCHDB_PORT,
    process.env.COUCHDB_DB,
    process.env.COUCHDB_USERNAME,
    process.env.COUCHDB_PASSWORD,
    true
);



POST: 
var json = {
            _id: "test1",
            test:1,
            data: { "mydata": "data is here" }
        }
let reply = await storage.update(json);
console.log(reply);


GET 
let reply = await storage.get("test1");
console.log(reply);


reply.test += 1;
reply = await storage.update(reply);
console.log(reply);
