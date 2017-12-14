'use strict';
var util = require('util');
const https = require('https');
const { URL } = require('url');
class CouchStorage {

    constructor(options) {
        this.options = options;        
        
        this.protocol = "http";
        if (this.options.use_https) {
            this.protocol += "s";
        }
        this.url = this.protocol + "://" + options.username + ":" + options.password + "@" + options.host + ":" + options.port + "/" + options.db + "/";
    }

    async get(id) {
        let _self = this;
        let url = _self.url + id;
        return new Promise((resolve, reject) => {
            try {
                util.log("loading [" + _self.options.db + "/" + id + "]");
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
                    href: _self.options.url,
                    host: _self.options.host,
                    username: _self.options.username,
                    password: _self.options.password,
                    protocol: _self.options.protocol+":",
                    path: "/" + _self.options.db,
                    port: _self.options.port,
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + new Buffer(_self.options.username + ':' + _self.options.password).toString('base64'),
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