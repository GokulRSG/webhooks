
const express = require('express')
const messaageResponse = require('twilio').twiml.MessagingResponse;
var bodyParser = require('body-parser')
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
  })
  
  app.get('/sms', function (req, res) {
    const twiml = new messaageResponse();
    twiml.message("thanks for messaging me");
    res.writeHead(200, {'Content-Type':'text/xml'});
    res.end(twiml.toString());
    //res.send('Hello World')
  });

app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Handle incoming messages from Twilio
app.post('/sms', (req, res) => {
    // Extract the message body from the request
    const messageBody = req.body.Body;
    console.log(req.body)
    // Log the received message body
    console.log('Received message:', messageBody);
    
    // Send a response back to Twilio (optional)
    res.set('Content-Type', 'text/plain');
    res.status(200).send('Message received. Thank you!'+messageBody);
});

  app.listen(3000,()=>{
    console.log("App Listening")
  })
