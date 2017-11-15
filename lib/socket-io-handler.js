'use strict';
const SocketIO = require('socket.io');

module.exports = function SocketioHandler(restifyServer, options) {

    const io = SocketIO(restifyServer);

    /**
     * Emit 'data' to all sockets for the provided User or array of Users.
     * 
     * @param {*} channelName 
     * @param {*} users 
     * @param {*} data 
     */
    function emitToUsers(users, channelName, data) {
        const usersArray = Array.isArray(users) ? users : [users];
        usersArray.map(function (user) {
            Object.keys(io.sockets.sockets).filter(function (key) {
                return io.sockets.sockets[key].transomUser._id.toString() === user._id.toString();
            }).map(function (socketKey) {
                io.sockets.sockets[socketKey].emit(channelName, data);
            });
        });
    }

    /**
     * Emit 'data' to all sockets for the authenticated Users.
     * 
     * @param {*} channelName 
     * @param {*} data 
     */
    function emitToEveryone(channelName, data) {
        Object.keys(io.sockets.sockets).filter(function (key) {
            return !!io.sockets.sockets[key].transomUser;
        }).map(function (socketKey) {
            io.sockets.sockets[socketKey].emit(channelName, data);
        });
    }

    return {
        emitToUsers,
        emitToEveryone,
        // simple getter that allows access to io, while dis-allowing updates.
        get io() {
            return io;
        }
    };
};