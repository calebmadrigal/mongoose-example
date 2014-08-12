mongoose-example
================

Example of using MongoDB + Mongoose + Express.js + Node.js to create a RESTful API.

## Description

Implements create, update, delete, load, and load all for a nested JSON structure representing an application for insurance for lawyers that follows this basic data model:

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

## Running

    # Install MongoDB

    # Install npm packages
    npm install

    # Run server
    node .

## Calling API

Create or update application:

    curl -X PUT -H 'Content-Type: application/json' -d '
    {
      "applicationId": "1",
      "mainApp": [{
        "firmName": "Test",
        "lawyers": [
          { "name": "Caleb", "ipApp": [{"doesPatents": true, "doesCopyrights": true}] },
          { "name": "Whitney", "ipApp": [{"doesPatents": false, "doesCopyrights": false}] }
        ]
      }]
    }' http://localhost:3000/reissueapp/1/

Load application:

    curl http://localhost:3000/reissueapp/1/

Load all application:

    curl http://localhost:3000/reissueapp/

Delete application:

    curl -X DELETE http://localhost:3000/reissueapp/2/

## Running tests

    npm test


