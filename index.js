// /**// * Cloud Function.
// *
// * @param {object} event The Cloud Functions event.
// * @param {function} callback The callback function.
// *
///// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//// http://www.apache.org/licenses/LICENSE-2.0
//// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';
const http = require('http');
// Imports the Google Cloud client library
const Datastore = require('@google-cloud/datastore');
// Your Google Cloud Platform project ID
const projectId = 'hnacino-sandbox-2';
// Instantiates a client
const datastore = Datastore({ projectId: projectId});
// The kind for the new entity
const kind = 'ticket';
// The Cloud Datastore key for the new entity
//const taskKey = datastore.key(kind);
exports.helpdesk = (req, res) => { // Get the city and date from the request 
  let ticketDescription = req.body.queryResult.queryText; // incidence is a required param 
  //let name = req.body.result.contexts[0].parameters['given-name.original'];
  let name = req.body.queryResult.outputContexts[0].parameters['given-name.original'];
  console.log('description is: ' +ticketDescription);
  console.log('name is: '+name);
  function randomIntInc (low, high) { 
    return Math.floor(Math.random() * (high - low + 1) + low);
  }
  let ticketnum = randomIntInc(11111,99999);
  // Prepares the new entity 
  const taskKey = datastore.key(kind, ticketnum);
  const task = {
    key: taskKey, data: {
      description: ticketDescription,
      name:name,
      ticketNumber: ticketnum
    }
  };
  console.log("ticket number is: " +ticketnum);
  // Saves the entity 
  datastore.insert(task)
    .then(() => {
    console.log('Saved task: '+taskKey );
    res.setHeader('Content-Type', 'application/json');
    //Response to send to Dialogflow
    res.json({ fulfillmentText: 'I have successfully logged your ticket, the ticket number is ' + ticketnum });
    //res.send(JSON.stringify({ 'speech': "I have successfully logged your ticket, the ticket number is " + ticketnum + ". Someone from the helpdesk will reach out to you within 24 hours.", 'displayText': "I have successfully logged your ticket, the ticket number is " + ticketnum + ". Someone from the helpdesk will reach out to you within 24 hours."}));
  }) .catch((err) => {
    console.error('ERROR:', err);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': "Error occurred while saving, try again later", 'displayText': "Error occurred while saving, try again later"}));
  });
}
