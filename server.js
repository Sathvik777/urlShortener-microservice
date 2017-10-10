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
  if(requested_url.includes("https://") || requested_url.includes("http://")){
    
  
  var short_url = connectDb(requested_url);
  var response_body = {
    "long_url": requested_url,
    "short_url" : "https://organic-opera.glitch.me/"+short_url
  }
  
    res.send(response_body);
  }
   res.status(400).send('Not https or http');
});


function connectDb(requested_url){
   var encoded_id = makeid();
  MongoClient.connect(db_url, encoded_id, function(err, db) {
  if (err) throw err;
  
  var myobj = { code : encoded_id,
    url: requested_url};
  db.collection("url_list").insertOne(myobj, function(err, res) {
    if (err) throw err;
    db.close();
  });
});
  return encoded_id;
}

app.get("/:endcoded_id" , function(req, res){
 var url_id = req.params.endcoded_id;
  console.log(url_id);
  var url_redirect;
  var query = {code : url_id }
  get_long_url(query, res);
  
});

function get_long_url(query ,res){
  MongoClient.connect(db_url, function(err, db) {
  if (err) throw err;
  db.collection("url_list").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result[0].url );
      if (result[0].url != undefined) {
          res.redirect(result[0].url ); 
        }
          db.close();
        });
    });
}


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
