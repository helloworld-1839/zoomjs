const fetch = require("node-fetch")
const http = require("http")
const EventEmitter = require("events");

class ChatbotMessage {
  /**
   * Represents a chatbot message
   * @param {Chatbot} chatbot The instantiating chatbot
   * @param {Object} messageData The data for the message
   */
  constructor(chatbot, messageData) {
    /**
     * Chatbot
     * @type {Chatbot}
     */
    this.chatbot = chatbot;
    /**
     * Robot Jid
     * @type {String}
     */
    this.robotJid = messageData.payload.robotJid;
    /**
     * To Jid
     * @type {String}
     */
    this.toJid = messageData.payload.toJid;
    /**
     * Channel
     * @type {Channel}
     */
    this.channel = new Channel(this.chatbot, this.toJid);
    /**
     * User Jid
     * @type {String}
     */
    this.userJid = messageData.payload.userJid;
    /**
     * Message Command
     * @type {String}
     */
    this.cmd = messageData.payload.cmd;
    /**
     * Account Id
     * @type {String}
     */
    this.accountId = messageData.payload.accountId;
    /**
     * User Name
     * @type {String}
     */
    this.name = messageData.payload.name;
    /**
     * Timestamp
     * @type {Number}
     */
    this.timestamp = messageData.payload.timestamp;
    /**
     * Time as Date Object
     * @type {Date}
     */
    this.time = new Date(this.timestamp);
  }
  /**
   * Replies to this message with basic text.
   * @param {String} head The message content/options
   * @param {String} body The message content/options
   */
  reply(head, body) {
    let msg = new ChatbotSendMessage({
      robotJid: this.robotJid,
      toJid: this.toJid,
      accountId: this.accountId
    });
    msg.setHeadText(head)
    if (body) {
      msg.addBodyField({type: "message", text: body});
    }
    fetch(`https://api.zoom.us/v2/im/chat/messages`, {
      method: "POST",
      body: msg.data,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.chatbot.access_token
      }
    });
  }
}
class Channel {
  /**
   * Represents a channel on Zoom.
   * @param {Chatbot} chatbot The instantiating chatbot
   * @param {String} jid The Jid of the channel (group or user)
   */
  constructor (chatbot, jid) {
    this.chatbot = chatbot;
    this.jid = jid;
  }
  send (head, body) {
    let msg = new ChatbotSendMessage({
      robotJid: this.robotJid,
      toJid: this.jid,
      accountId: this.accountId
    });
    msg.setHeadText(head)
    if (body) {
      msg.addBodyField({type: "message", text: body});
    }
    fetch(`https://api.zoom.us/v2/im/chat/messages`, {
      method: "POST",
      body: msg.data,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.chatbot.access_token
      }
    });
  }
}
class ChatbotSendMessage {
  /**
   * Creates a new message that can be sent.
   * @param {Object} options The bot options
   * @param {String} options.robotJid The robot Jid 
   * @param {String} options.toJid The to Jid
   * @param {String} options.accountJid The account Jid
   * @param {Object} options.content
   * @param {Object} options.content.head
   * @param {String} options.content.head.text
   * @param {Array} options.content.body
   */
  constructor (options) {
    if (options) {
      /**
       * Robot Jid
       * @type {String}
       */
      this.robot_jid = options.robotJid;
      /**
       * To Jid
       * @type {String}
       */
      this.to_jid = options.toJid;
      /**
       * Account Id
       * @type {String}
       */
      this.account_id = options.accountId;
      /**
       * Message Content
       * @type {Object}
       */
      this.content = {};
      /**
       * Message Content Head
       * @type {Object}
       */
      this.content.head = {};
      /**
       * Message Content Body
       * @type {Array}
       */
      this.content.body = [];
      if (options.content) {
        this.content = options.content;
      }
      if (options.content && typeof options.content.head === "object") {
        this.content.head = options.content.head;
      }
      else {
        this.content.head = {}
      }
      if (options.content && typeof options.content.head === "object") {
        this.content.body = options.content.body;
      }
      else {
        this.content.body = [];
      }
    }
  }
  setRobotJid (jid) {
    this.robot_jid = jid;
    return this;
  }
  setToJid (jid) {
    this.to_jid = jid;
    return this;
  }
  setAccountJid(jid) {
    this.account_jid = jid;
    return this;
  }
  setContent(cont) {
    this.content = cont;
    return this;
  }
  setHead(head) {
    this.content.head = head;
    return this;
  }
  setHeadText (txt) {
    this.content.head.text = txt;
    return this;
  }
  addBodyField (obj) {
    this.content.body.push(obj);
    return this;
  }
  get data () {
    if (!this.content.body || this.content.body.length < 1) {
      delete this.content.body;
    }
    return JSON.stringify(this)
  }
}
class ChatbotBodyField {
  /**
   * Creates a new Message Content Body Field
   * @param {Object} options Options
   * @param {String} options.type type
   * @param {String} options.text text
   */
  constructor (options) {
    this.type = options.type;
    this.text = options.text;
  }
  setType (t) {
    this.type = t;
    return this;
  }
  setText (t) {
    this.text = t;
    return this;
  }
}
class Chatbot extends EventEmitter {
  /**
   * Creates a new Zoom Chatbot.
   * @param {Object} options The chatbot options
   */
  constructor(options) {
    super();
    /**
     * The client id of the application
     * @type {String}
     */
    this.client_id;
    /**
     * The client secret of the application
     * @type {string}
     */
    this.client_secret;
    /**
     * The access token of the bot
     * @type {string}
     */
    this.access_token;
    /**
     * The bot request server
     * @type {http.Server}
     */
    this.server;
  }
  /**
   * @typedef {["bot_notification" | "someOtherEvent", ...any[]]} eventsDef
   */
  /**
   * @param {eventsDef} args
   */
  addListener(...args) {
    super.addListener(...args);
  }
  /**
   * @param {eventsDef} args
   */
  on(...args) {
    super.on(...args);
  }
  /**
   * Authorizes the bot and gains an access token using the client id and secret.
   * @param {String} client_id The Client Id of the bot
   * @param {String} client_secret The Client Secret of the bot
   * @returns {String} The access token or undefined 
   */
  async authorize(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    let res = await fetch(`https://zoom.us/oauth/token?grant_type=client_credentials`, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(this.client_id + ":" + this.client_secret).toString("base64")
      }
    });
    let resJson = await res.json();
    this.access_token = resJson.access_token
    return this.access_token;
  }
  /**
   * Sets up the server to receive messages
   * @param {Object} options The server options
   * @param {Number} options.port The port number
   * @param {String} options.cmd_url The chat command server request url
   * @returns Returns the server
   */
  createServer(options) {
    let port = options && options.port ? options.port : 3000;
    let requrl = options && options.cmd_url ? options.cmd_url : "/"
    this.server = http.createServer((req, res) => {
      let url = req.url;
      switch (url) {
        case requrl: {
          let data;
          req.on("data", chunk => {
            data += chunk;
          });
          req.on("end", () => {
            data = data.slice(9)
            data = JSON.parse(data)
            let event = data.event;
            if (event === "bot_notification") {
              let message = new ChatbotMessage(this, data);
              /**
               * Emitted whenever a custom emoji is created in a guild.
               * @event Chatbot#bot_notification
               * @param {ChatbotMessage} message The message that was created
               */
              this.emit("bot_notification", message);
            }
          });
        }
      }

    }).listen(port);
    return this.server;
  }
  /**
   * Sends a chatbot message
   * @param {String|Object} message The message. 
   */
  send(message) {
    let msgObj;
    fetch(`https://api.zoom.us/v2/im/chat/messages`, {
      method: "POST",
      body: JSON.stringify(msgObj),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.access_token
      }
    });
  }
}

module.exports = {
  Chatbot,
  ChatbotMessage,
  ChatbotSendMessage
};