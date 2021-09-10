<div align="center">
  <h1 align="center"><b>Zoom JS Documentation</b></h3>
</div>

# Getting Started
To start using the wrapper, you will need to create a new Chatbot that is attached to your application's client id and secret. Then run the server and use the server url as your chatbot's endpoint url.

Below is an example of a basic setup for a Zoom chatbot.
```js
// Import stuff.
const Zoom = require("zoom.js");

// Set up id and secret.
const client_id = "YOUR_CLIENT_ID";
const client_secret = "YOUR_CLIENT_SECRET";

// Create a new Chatbot.
const bot = new Zoom.Chatbot();

// Listen for "bot_notification" events (new commands).
bot.on("bot_notification", async message => {
  if (message.cmd === "hi") {

    // Reply to the message with the header as "Zoom Chatbot"
    // and the body set as "Hello!".
    message.reply("Zoom Chatbot", "Hello!");
  }
});

// Create the server.
bot.createServer();

// Get the access token from client id and secret.
bot.authorize(client_id, client_secret);
```

# Classes
* [Chatbot](#chatbot)
* [ChatbotMessage](#chatbotmessage)
&nbsp;

&nbsp;

## Chatbot
Creates a new chatbot interface. This is the starting point of a chatbot.

### Constructor
```js
new Zoom.Chatbot();
```
### Properties
Property | Type | Description
---------|------|------------
`client_id` | `String` | The client id of the application.
`client_secret` | `String` | The client secret of the application.
`access_token` | `String` | The access token of the chatbot.
`server` | `http.Server` | The main bot command server.

### Methods
### `authorize`
Authorizes the bot and gains an access token using the client id and secret.
Parameter | Type | Description
----------|------|------------
`client_id` | `String` | The client id of the application.
`client_secret` | `String` | The client secret of the application.
&nbsp;
### `createServer`
Sets up the server to receive commands.
Parameter | Type | Optional  | Default| Description
 -------- | ---- | --------- | ------ | ----------
`options` | `Object` | `true` | `{}` | The server options.
`options.port` | `Number` | `true` | `3000` | The port number.
`options.cmd_url` | `Number` | `true` | `/` | The chat command server request url

### Events
### `bot_notification`
Emmited when the bot receives a command.
Parameter | Type | Description
----------|------|------------
`message` | `Zoom.ChatbotMessage` | The message command received.

&nbsp;

&nbsp;

## ChatbotMessage
Represents a command message to a chatbot on Zoom.
### Constructor
```js
new Zoom.ChatbotMessage(chatbot, messageData);
```
Parameter | Type | Description
----------|------|------------
`chatbot` | `Zoom.Chatbot` | The instantiating chatbot.
`messageData` | `Object` | The data of the message command.

### Properties
Property | Type | Description
----------|------|------------
`chatbot` | `Zoom.Chatbot` | The instantiating chatbot
`robotJid`| `String` | The robot jid of the message
`toJid`| `String` | The to jid of the message
`userJid`| `String` | The user jid of the message
`cmd`| `String` | The message command
`accountId`| `String` | The account id of the message
`name`| `String` | The name of the sender
`timestamp`| `Number` | The time that the message was sent.
`time`| `Date` | The time that the message was sent as a Date Object.
### Methods
### `authorize`
Replies to this message with text.
Parameter | Type | Description
----------|------|------------
`head` | `String` | The message head text.
`body` | `String` | The message body text.