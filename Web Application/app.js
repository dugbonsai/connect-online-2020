var express = require('express');
var couchbase = require('couchbase')
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/resources'));

// Update couchbaseCluster with IP address of a node in your Couchbase cluster
var couchbaseCluster = 'couchbase://127.0.0.1/'
var cluster = new couchbase.Cluster(couchbaseCluster);
cluster.authenticate('userprofile_user', 'password');

var bucket = cluster.openBucket('userprofile');
var userDocument;

var server = app.listen(5000, function () {
  console.log('Node server is running..');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/profileLookup', function (req, res) {
  console.log("getting document: user::" + req.body.email);
  bucket.get("user::" + req.body.email, function (err, result) {
    userDocument = result.value;
    res.redirect('/profile?email=' + userDocument.email + "&name=" + userDocument.name + "&address=" + userDocument.address + "&university=" + userDocument.university);
  });
});

app.get('/profile', function(req, res) {
  res.sendFile(__dirname + '/profile.html');
});

app.post('/updateProfile', function(req, res) {
  userDocument.email = req.body.email;
  userDocument.name = req.body.name;
  userDocument.address = req.body.address;
  userDocument.university = req.body.university;
  bucket.upsert("user::" + userDocument.email, userDocument, function (err, result) {
    res.sendFile(__dirname + '/results.html');
  });
});
