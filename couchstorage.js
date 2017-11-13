'use strict';
var util = require('util');
const https = require('https');
const { URL } = require('url');
class CouchStorage {

    constructor(host, port, db, userid, password, secure) {
        this.host = host;
        this.port = port;
        this.db = db;
        this.userid = userid;
        this.password = password;
        this.url = "http";
        this.secure = secure;
        if (secure) {
            this.url += "s";
        }
        this.url += "://" + userid + ":" + password + "@" + host + ":" + port + "/" + db + "/";
    }

    async get(id) {
        let _self = this;
        let url = _self.url + id;
        return new Promise((resolve, reject) => {
            try {
                //util.log("loading [" + url + "]");
                https.get(url, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    resp.on('end', () => {
                        resolve(JSON.parse(data));
                    });

                }).on("error", (err) => {
                    reject(err);
                });

            } catch (error) {
                reject(err);
            }
        });
    }

    async update(doc) {
        let _self = this;
        return new Promise((resolve, reject) => {
            util.log("updating...");
            let id = doc.id || doc._id;

            _self.get(id).then(currentDoc => {

                if (typeof currentDoc !== "undefined") {
                    doc._rev = currentDoc._rev;
                }

                let _self = this;
                let docId = (doc.id || doc._id);
                let url = _self.url + docId;
                // return new Promise((resolve, reject) => {            
                var options = {
                    href: _self.url,
                    host: _self.host,
                    username: _self.userid,
                    password: _self.password,
                    protocol: "https:",
                    path: "/" + _self.db,
                    port: _self.port,
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + new Buffer(_self.userid + ':' + _self.password).toString('base64'),
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        "Content-Length": Buffer.byteLength(JSON.stringify(doc)),
                    }
                };
        
                var req = https.request(options, function (res) {
                    var str = "";
        
                    res.on("data", function (data) {
                        str += data;
                    });
                    res.on("end", function () {
                        resolve(JSON.parse(str));                       
                    });
                }).on('error', (e) => {
                    reject(`problem with request: ${e.message}`);
                }).end(JSON.stringify(doc));;     
                           
            });
        }).catch(e => reject(e));
    }
}


module.exports = CouchStorage;