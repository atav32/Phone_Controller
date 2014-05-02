// Serve Static Files
var express = require('express');
var app = express();
var oneDay = 86400000;
app.use(express.static(__dirname + '/public_files', { maxAge: oneDay}));
app.listen(process.env.PORT || 1313);

// Primus
'use strict';
var Primus = require('primus')
    , http = require('http')
var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.end("Primus!?!?!?");
}), primus = new Primus(server,{});

primus.save(__dirname + '/public_files/js/primus.js');

var ipToSparks = {};

primus.on('connection', function (spark) {
    var ip = spark.address.ip + "";
    ipToSparks[ip] = spark;
    spark.write({'ip':ip});
    spark.on('data',function message(data) {
        if (data.ip) {
            spark.browserSpark = ipToSparks[data.ip + ""]; 
            console.log("Paired: " + spark.address.ip + " to " + data.ip);
        } else {
            if (spark.browserSpark) {
                spark.browserSpark.write(data);
            } else {
                console.log("no browser spark?");
            }
        }
    });
    console.log("Connect: " + spark.address.ip);
});

primus.on('disconnection', function(spark) {
    console.log("Disconnect: " + spark.address.ip);
});

server.listen(1310);
