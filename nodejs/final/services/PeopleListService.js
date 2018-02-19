'use strict';

var path = require('path');
var fs = require('fs');
var mongoClient = require("mongodb").MongoClient;

exports.peopleGet = function(args, res, next) {
  /**
   * Get people list
   * returns inline_response_200
   **/

  readFromMongo(res, returnResponse);
}

var returnResponse = function(res, data) {
  res.setHeader('Content-Type', 'application/json');
  var json = JSON.stringify(data);
  res.end(json);
}

var readFromFiles = function(res, callback) {
  var list = [];
  var dirname = path.join(AppBase, 'data');
  fs.readdir(dirname, 'utf8', function(err, files) {
    var remaining = files.length;
    files.forEach(function(value) {
      var filename = path.join(AppBase, 'data', value);
      fs.readFile(filename, 'utf8', function(err, data) {
        if(err) throw err;
        var obj = JSON.parse(data);
        list.push(obj);
        remaining -= 1;
        if(remaining == 0) {
          callback(res,list);
        }
      });
    });
  });
}

var readFromMongo = function(res,callback) {
  mongoClient.connect(settings.ConnectionString, function (err, db) {
    if(err) throw err;

    // Switch DB from 'admin' (default) to the desired Database, this is far from obvious
    db = db.db(settings.Database);
    
    var data = db.collection(settings.Collection).find().toArray(function(err, result) {
      if (err) throw err;
      if(result) {
        callback(res,  result);
      } else {
        callback(res, [] );
      }
    });
    db.close();
  });

}