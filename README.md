<div align="center">
  <h1 align="center"><b>Zoom JS</b></h3>
</div>

# Getting Started
To start using the wrapper, you will need to create a new Chatbot that is attached to your application's client id and secret. Then run the server and use the server url as your chatbot's endpoint url.

You can get you client id and secret from the zoom app marketplace manage area.

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
# **Zoom JS Documentation**
### The full documentation for this can be found here:
### **[Open the docs](docs.md)**
