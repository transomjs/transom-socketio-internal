# transom-socketio-internal
Add a socket server to your Transom based REST API. Send messages to subscribed clients in real-time. This plugin is the 'internal' implementation of the asynchronous messaging. Out of process messaging, potentially backed by a queue, can be provided by another plugin.

[![Build Status](https://travis-ci.org/transomjs/transom-socketio-internal.svg?branch=master)](https://travis-ci.org/transomjs/transom-socketio-internal)
[![Coverage Status](https://coveralls.io/repos/github/transomjs/transom-socketio-internal/badge.svg?branch=master)](https://coveralls.io/github/transomjs/transom-socketio-internal?branch=master)

## Installation

```bash
$ npm install --save @transomjs/transom-socketio-internal
```

## Usage

``` Javascript
'use strict';

var Transom = require('@transomjs/transom-core');
var transomMongoose = require('@transomjs/transom-mongoose');
var transomSocketIOInternal = require('@transomjs/transom-socketio-internal');
var transomMongooseNonce = require('@transomjs/transom-mongoose-nonce');

const transom = new Transom();

// Register the plugins.

transom.configure(transomMongoose, {
	mongodbUri: CONNECT_STRING
});

transom.configure(transomMongooseNonce);
transom.configure(transomSocketIOInternal);

var myApi = require('./myApi');

// Initialize them all at once.
var server = transom.initialize(myApi);

transomSocketIOInternal.initializeWithServer(restifyApp);

```

## Establishing a connection

From your application you need to call the rest API to request a socket token:
{baseUrl}/user/sockettoken 
Internally transom-mongoose-nonce plugin is used to provide the token.

You then apply the token to the query object on the socket client. The client will establish the 
connection to the server using the token in their 'handshake' after which the socket token is invalidated.

``` javascript
 var socket = io.connect('', {
    query: 'token=' + token
  });
```


## Sending messages
The transom-socketio-internal plugin registers the 'transomMsgClient' with transom core. You may use this client where you have access to the transom server, 
including in the `actions` of the mongoose entities (transom-mongoose) or in your [server functions](https://github.com/transomjs/transom-server-functions/blob/master/README.md) to send custom messages to all or subsets of connected users.

### The Transom Message Client
The plugin registers the message client with the server under the string literal `transomMsgClient`. It has the following spec. Note that you can obtain a reference to the internal [socket io server](https://socket.io/docs/server-api/). As well, sending messages to known users requires [transom-mongoose-localuser](https://github.com/transomjs/transom-mongoose-localuser/blob/master/README.md)

``` Javascript
transomMsgClient = {
    /*
    Send a json payload to a list of named users on a named channel
    @param users: array of user objects that include the _id property. Alternatively, a single user object.
    @param channelName: string, predefined channel name that the users are listening on.
    @param data: Object, the JSON payload of the message
    */
    emitToUsers: function(users, channelName, data) {...},

    /*
    Send a json payload to all connected users on a named channel
    @param channelName: string, predefined channel name that the users are listening on.
    @param data: Object, the JSON payload of the message
    */
    emitToEveryone: function(channelName, data){...},

    /*
    Readonly property returning a reference to the socketIO server
    */
    io: socketIO

}
```

