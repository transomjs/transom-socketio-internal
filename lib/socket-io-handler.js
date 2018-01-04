'use strict';

/**
 * Module for the socket handler. Exports this function that creates the instance of the handler.
 * which is added to the server registry as 'transomMessageClient'
 * @param {*} io the initialized SocketIO server
 * @param {*} options The socketHandler options object
 */

function SocketioHandler(io, options) {

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

module.exports = SocketioHandler;