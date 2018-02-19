'use strict';

var path = require('path');
var fs = require('fs');
var mongoClient = require("mongodb").MongoClient;

exports.getPersonById = function(args, res, next) {
  /**
   * Find people by ID
   * Returns a single people
   *
   * peopleId String ID of person to return
   * returns inline_response_200
   **/
  var peopleId = args.peopleId.value;
  var data = peopleFromMongo(peopleId, res, returnResponse);
}

var returnResponse = function(res, data) {
  res.setHeader('Content-Type', 'application/json');
  var json = JSON.stringify(data);
  res.end(json);
}

var peopleFromFleId = function(id, res, callback) {
  var filename = path.join(AppBase, 'data', peopleId + ".json");
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    //var obj = JSON.parse(data);
    callback(res, data);
  });
}

var peopleFromMongo = function(id, res, callback) {
  mongoClient.connect(settings.ConnectionString, function (err, db) {
    if(err) throw err;

    // Switch DB from 'admin' (default) to the desired Database, this is far from obvious
    db = db.db(settings.Database);
    
    // var o_id = new ObjectId(id);
    var query = { "_id" : id };
    
    var data = db.collection(settings.Collection).find(query).toArray(function(err, result) {
      if (err) throw err;
      if(result) {
        callback(res,  result[0] );
      } else {
        callback(res, {} );
      }


    });
    db.close();
  });
}