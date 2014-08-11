#!/bin/bash

curl -X PUT -H 'Content-Type: application/json' -d '
{
  "applicationId": "2",
  "mainApp": [{
    "firmName": "Test",
    "lawyers": [
      { "name": "Caleb", "ipApp": [{"doesPatents": true, "doesCopyrights": true}] },
      { "name": "Whitney", "ipApp": [{"doesPatents": false, "doesCopyrights": false}] }
    ]
  }]
}' http://localhost:3000/reissueapp/2/

