// Example RESTful API with Mongoose, MongoDB, Express.js, and Node.js

/////////////////////////////////////////////////////////////////////////////////////////// REQUIRES
var express = require('express');
var slash = require('express-slash');
var mongoose = require('mongoose');
var q = require('q');
var _ = require('lodash');

////////////////////////////////////////////////////////////////////////////////////// DB CONNECTION

// Note: even though this variable isn't used directly, this call connects us to the db.
var db = mongoose.connect('mongodb://localhost/subdoc1to1');

/////////////////////////////////////////////////////////////////////////////////////////// MONGOOSE

/* Example application JSON:

{
  "applicationId": "1",
  "mainApp": [{
    "firmName": "Test1",
    "lawyers": [
      { "name": "Caleb", "ipApp": [{"doesPattents": true, "doesCopyrights": false}] },
      { "name": "John", "ipApp": [{"doesPattents": false, "doesCopyrights": true}] },
    ]
  }]
}

*/

var ipAppSchema = mongoose.Schema({
  doesPatents: Boolean,
  doesCopyrights: Boolean
});

var lawyerSchema = mongoose.Schema({
  name: String,
  ipApp: [ipAppSchema]
});

var mainAppSchema = mongoose.Schema({
  firmName: String,
  lawyers: [lawyerSchema]
});

var applicationSchema = mongoose.Schema({
  applicationId: String,
  mainApp: [mainAppSchema]
});

applicationSchema.statics.load = function (applicationId) {
  var defer = q.defer();

  Application.findOne({'applicationId': applicationId}, function (err, applicationModel) {
    if (err) {
      defer.reject(err);
    }
    else if (applicationModel) {
      defer.resolve(applicationModel);
    }
    else {
      defer.reject('Failed to find application');
    }
  });

  return defer.promise;
};

applicationSchema.statics.save = function (applicationId, applicationJson) {
  var defer = q.defer();

  var applicationToSave = null;

  Application.findOne({'applicationId': applicationId}, function (err, applicationModel) {
    if (applicationModel) {
      // Application found - update it
      applicationToSave = _.merge(applicationModel, applicationJson);
    }
    else {
      // Application not found - create it
      applicationToSave = new Application(applicationJson);
      applicationToSave.applicationId = applicationId;
    }

    applicationToSave.save(function (err, result) {
      if (err) {
        defer.reject(err);
      }
      else {
        defer.resolve('Successfully saved application');
      }
    });
  });

  return defer.promise;
};

var Application = mongoose.model('Application', applicationSchema);

///////////////////////////////////////////////////////////////////////////////////// WEB CONTROLLER

var loadAllApplications = function (req, res) {
  Application.find({}, function (err, applicationList) {
    if (err) {
      res.json(400, {'message': 'Failed to load applications: ' + err.toString()});
    }
    else {
      res.json(applicationList);
    }
  });
};

var loadApplication = function (req, res) {
  if (req.params.applicationId != null) {
    var applicationId = req.params.applicationId;

    Application.load(applicationId).then(
      function (applicationModel) {
        res.json(applicationModel);
      },
      function (err) {
        res.json(400, {'message': 'Failed to load application: ' + err.toString()});
      }
    );
  }
  else {
    res.json(400, {'message': 'applicationId required'});
  }
};

var saveApplication = function (req, res) {
  if (req.params.applicationId != null) {
    var applicationId = req.params.applicationId;
    var applicationJson = req.body;

    Application.save(applicationId, applicationJson).then(
      function (saveResultMessage) {
        res.json({'message': saveResultMessage});
      },
      function (err) {
        res.json(400, {'message': 'Failed to save application: ' + err.toString()});
      }
    );
  }
  else {
    res.json(400, {'message': 'applicationId required'});
  }
};

var removeApplication = function (req, res) {
  if (req.params.applicationId != null) {
    var applicationId = req.params.applicationId;

    Application.remove({'applicationId': applicationId}, function (err, applicationModel) {
      if (err) {
        res.json(400, {'message': 'Failed to remove application: ' + err.toString()});
      }
      else {
        res.json({'message': 'Successfully removed application.'});
      }
    });
  }
  else {
    res.json(400, {'message': 'applicationId required'});
  }
  
};

///////////////////////////////////////////////////////////////////////////////////////// MIDDLEWARE

var app = express();
app.use(express.bodyParser());
app.use(slash()); // Redirects /reissue to /reissue/ (and the like)

///////////////////////////////////////////////////////////////////////////////////////////// ROUTES

app.get('/reissueapp/', loadAllApplications);
app.get('/reissueapp/:applicationId/', loadApplication);
app.put('/reissueapp/:applicationId/', saveApplication);
app.post('/reissueapp/:applicationId/', saveApplication);
app.delete('/reissueapp/:applicationId/', removeApplication);

////////////////////////////////////////////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 3000;
app.listen(port, function () { console.log("Listening on port", port); });

