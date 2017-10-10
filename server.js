// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db_url = "mongodb://sathvikkatam:Unicorn_123@ds113435.mlab.com:13435/urlshort";

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.get("/short-it/*" , function(req, res){
  var requested_url = req.params[0];
  connectDb(requested_url);
  var response_body = {
    "long_url": requested_url
  }
  
  res.send(response_body);
});


function connectDb(requested_url){
  MongoClient.connect(db_url, function(err, db) {
  if (err) throw err;
  var myobj = { url: requested_url};
  db.collection("url_list").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted "+res._id);
    db.close();
  });
});
}

app.get("/:endcoded_id" , function(req, res){
 var url_id = req.params.endcoded_id;
  var url_redirect;
  var query = {_id : url_id }
  MongoClient.connect(db_url, function(err, db) {
  if (err) throw err;
  db.collection("url_list").find(query).toArray(function(err, result) {
    if (err) throw err;
        url_redirect = result;
          db.close();
        });
    });
  res.redirect(url_redirect);
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
