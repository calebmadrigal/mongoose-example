var frisby = require('frisby');

frisby.create('Save application')
  .post('http://localhost:3000/reissueapp/3/', {
      "applicationId": "3",
      "mainApp": [{
        "firmName": "Test",
        "lawyers": [
          { "name": "Caleb", "ipApp": [{"doesPatents": true, "doesCopyrights": true}] },
          { "name": "Whitney", "ipApp": [{"doesPatents": false, "doesCopyrights": false}] }
        ]
      }]
    }, {json: true})
  .expectStatus(200)
  .expectJSON({'message': 'Successfully saved application'})
  .toss();

frisby.create('Get application')
  .get('http://localhost:3000/reissueapp/3/', {json: true})
  .expectStatus(200)
  .expectJSON({
    applicationId: "3"
  })
  .toss();

frisby.create('Update application')
  .put('http://localhost:3000/reissueapp/3/', {
      "applicationId": "3",
      "mainApp": [{
        "firmName": "Test2",
        "lawyers": [
          { "name": "Caleb2", "ipApp": [{"doesPatents": true, "doesCopyrights": false}] },
          { "name": "Whitney", "ipApp": [{"doesPatents": false, "doesCopyrights": false}] }
        ]
      }]
    }, {json: true})
  .expectStatus(200)
  .expectJSON({'message': 'Successfully saved application'})
  .toss();

frisby.create('Check updated fields are correct')
  .get('http://localhost:3000/reissueapp/3/', {json: true})
  .expectStatus(200)
  .expectJSON({
    mainApp: [{
      firmName: "Test2",
      lawyers: [
        { name: "Caleb2", ipApp: [{doesCopyrights: false}] }
      ]
    }]
  })
  .toss();

frisby.create('Delete application')
  .delete('http://localhost:3000/reissueapp/3/', {json: true})
  .expectStatus(200)
  .toss();

frisby.create('Verify that app was deleted')
  .get('http://localhost:3000/reissueapp/3/', {json: true})
  .expectStatus(400)
  .toss();

