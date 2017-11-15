'use strict';
const SocketioHandler = require('./lib/socket-io-handler');
const SocketIO = require('socket.io');

function TransomSocketIOInternal() {
    const args = {};
    const INVALID_TOKEN = "INVALID_TOKEN";

    this.initialize = function (server, options) {
        args.server = server;
        args.options = options || {};
    }

    this.initializeWithServer = function (restifyServer, io) {
        if (!io){
            //no io server provided on the options, we'll create it here
            io = SocketIO(restifyServer);
        }
        io.use(args.options.authMiddleware || this.nonceAuthMiddleware);

        const msgClient = new SocketioHandler(io, args.options);
        args.server.registry.set('transomMessageClient', msgClient);

        return msgClient;
    }

    this.nonceAuthMiddleware = function (socket, next) {
        const nonce = args.server.registry.get(args.options.NonceHandler || 'transomNonce');
        nonce.verifyNonce(socket.handshake.query.token, function (err, payload) {
            if (err) {
                setTimeout(function () {
                    // console.log('Socket Authentication failed. Disconnecting.', err);
                    socket.disconnect(true);
                }, 20);
                return next(new Error(INVALID_TOKEN));
            }
            // Copy the User object on each verified socket connection,
            // we'll use this later to emit data to specific users.
            socket.transomUser = payload;
            return next();
        })
    }
}

module.exports = new TransomSocketIOInternal();