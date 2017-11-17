# transom-socketio-internal
Add a socket server to your Transom based REST API. Send messages to subscribed clients in real-time.

[![Build Status](https://travis-ci.org/transomjs/transom-socketio-internal.svg?branch=master)](https://travis-ci.org/transomjs/transom-socketio-internal)
[![Coverage Status](https://coveralls.io/repos/github/transomjs/transom-socketio-internal/badge.svg?branch=master)](https://coveralls.io/github/transomjs/transom-socketio-internal?branch=master)

## Installation

```bash
$ npm install --save @transomjs/transom-socketio-internal
```
## Introduction
The transom-socket-io-internal plugin adds ansycronous communication to your server. It is designed to 
use the same server process as transom-core. This is useful for small deployments where scaling is not
a concern. It allows for a complete set of functionality that is easily deployed on a single docker 
instance or droplet.
If scaling it required then another plugin will be needed to provide the same 'transomMsgClient' functions.

## Usage

From your application you need to call the rest API to request a socket token:
{baseUrl}/user/sockettoken
The received token is then applied to the query object on the socket client. The client will establish the 
connection to the server using the token in their 'handshake' after which the socket token is invalidated.

...Work in Progress.