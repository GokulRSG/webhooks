const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");

const app = express().use(bodyParser.json());

const urltoken = process.env.URLTOKEN;
const mytoken = process.env.MYTOKEN;

app.listen(process.env.PORT, () => {
  //res.send('Hello World');
  console.log("Application Listening");
});

// console.log("API token = "+token);
// https://2bb7-103-28-246-120.ngrok-free.app/webhook

app.get("/webhook", function (req, res) {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  console.log("API token = " + token);
  console.log("API mode = " + mode);

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.send(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let bodyParam = req.body;

  //console.log(JSON.stringify(bodyParam,null,2));
  console.log(bodyParam.object);
  if (bodyParam.object === "whatsapp_business_account") {
    let phone_no_id =
      bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
    // console.log(bodyParam.entry[0].changes[0].value.metadata.phone_number_id);
    let from = bodyParam.entry[0].changes[0].value.messages[0].from;
    let msgBody = bodyParam.entry[0].changes[0].value.messages[0].text.body;

    // console.log(bodyParam.entry[0].changes[0].value.messages[0].text.body);

    //  console.log(msgBody);
    // console.log("Phone ID"+phone_no_id+" From Number"+from)
    console.log(phone_no_id);
    axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${phone_no_id}/messages?access_token=EAAPLbIL4ZCvQBO7UuiyOJ7q25RwXcZA7SehxatPnrADlFZANPX0fZBcmAfXyZBdXPM3ZC1ZC3ZAGMZCiTlfUhaSGWlg2bXI1z9ZCZAHewEWZBCJrROzLI8uFOZAo999VKOPHBJtZAvdXfQUmFZBcnlossO8ZBiihYmvlQOvId6Kk1NqqoNHO4LXCrAzgG3cZC7ZCAJDDef7Unxtp4LZC3f9o887XwWQujUZD`,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "text",
        text: {
          preview_url: false,
          body: `You texted ${msgBody}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Message sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending message:", error.response.data);
      });

    res.sendStatus(200);
  } else {
    res.send(404);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("WebHook Stated....");
});
