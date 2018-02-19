'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

    var mongoClient = require("mongodb").MongoClient;

    // This is the format of the configuration file (case sensitive)
    var _settings = {
        "ConnectionString" : "",
        "Database" : "",
        "Collection" : ""
    };

    var filename = "./settings.json";
    fs.readFile(filename, 'utf8', function (err, data) { 
        if(err) throw err;

        _settings = JSON.parse(data);
        
        console.log(_settings.ConnectionString);
        console.log(_settings.Database);
        console.log(_settings.Collection);
        
        global.settings = _settings;

        setupMongo();
    });


var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');

var serverPort = 8080;

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers')
};

global.AppBase = __dirname;

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});

var setupMongo = function() {
  mongoClient.connect(settings.ConnectionString, function (err, db) {
      if(err) throw err;

      // Switch DB from 'admin' (default) to the desired Database, this is far from obvious
      db = db.db(settings.Database);
      console.log('Current DB: ' + db.databaseName);

      // if there are no records read the data/ folder and make some
      anyRecords(db,makeMongoTestData); 

      db.close();
  });
}

var makeMongoTestData = function(db) {
  const testFolder = path.join(__dirname, 'data');
  fs.readdirSync(testFolder).forEach(filename => {
    filename = path.join(testFolder,filename);
    console.log(filename);
    try {
      var data = fs.readFileSync(filename, 'utf8');
      var json = JSON.parse(data);
      db.collection(settings.Collection).insert(json);
    } catch(e) {
      Console.log(e.message);
    }
  });
}

var anyRecords = function(db, callback) {
    db.collection(settings.Collection).find().toArray(function(err, items) {
        if(err) throw err;
        if(items) {
          if(items.length <= 0) {
            callback(db);
          }
        }
      });
  };

