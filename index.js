'use strict';
const SocketioHandler = require('./lib/socket-io-handler');

function TransomSocketIOInternal() {
    const args = {};
    const INVALID_TOKEN = "INVALID_TOKEN";

    this.initialize = function (server, options) {
        // console.log('Initializing TransomSocket.io.internal');
        args.server = server;
        args.options = options || {};
    }

    this.initializeWithServer = function (restifyApp) {
        // console.log("Initializing internal socket server");

        const msgClient = new SocketioHandler(restifyApp, args.options);
        args.server.registry.set('messageClient', msgClient);

        // console.log('Ready to accept socket connections ...');

        msgClient.io.use(args.options.authMiddleware || this.nonceAuthMiddleware);

        // msgClient.io.on('connect', function (socket) {
        //     console.log('new connect on the internal');
        // });
        // msgClient.io.on('connection', function (socket) {
        //     console.log('new connection on the internal socket server');
        // });
        // msgClient.io.on('disconnect', function () {
        //     console.log('disconnected from server', arguments);
        // });

        return msgClient;
    }

    this.nonceAuthMiddleware = function (socket, next) {
        const nonce = args.server.registry.get('nonce');
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