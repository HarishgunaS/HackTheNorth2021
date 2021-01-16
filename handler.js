// Import the service function and various response classes
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
  } = require('actions-on-google');
const express = require('express');
const bodyParser = require('body-parser');  

// const app = dialogflow();

// app.intent('Default Welcome Intent', (conv) => {
//     conv.ask('How are you?');
//   });
  
// app.intent('bye', (conv) => {
//     conv.close('See you later!');
//   });

const {
  conversation
} = require('@assistant/conversation')

// Create an app instance
const app = conversation()

// Register handlers for Actions SDK

app.handle('handler', conv => {
  conv.add('Hi, how is it going?')
  conv.add(new Image({
    url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    alt: 'A cat',
  }))
})
const PORT = process.env.PORT || 3000;
express().use(bodyParser.json(), app).listen(PORT);