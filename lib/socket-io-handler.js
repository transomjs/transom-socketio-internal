'use strict';

/**
 * Module for the socket handler. Exports this function that creates the instance of the handler.
 * which is added to the server registry as 'transomMessageClient'
 * @param {*} io the initialized SocketIO server
 * @param {*} options The socketHandler options object
 */

function SocketioHandler(io, options) {

    /**
     * Disconnect sockets for the provided User(s) & optionally close them.
     * 
     * @param {*} users 
     * @param {*} close
     */
    function disconnectUsers(users, close) {
        const usersArray = Array.isArray(users) ? users : [users];
        usersArray.forEach((user) => {
            Object.keys(io.sockets.sockets).filter((key) => {
                return io.sockets.sockets[key].transomUser && io.sockets.sockets[key].transomUser._id.toString() === user._id.toString();
            }).forEach((socketKey) => {
                io.sockets.sockets[socketKey].disconnect(close);
            });
        });
    }

    /**
     * Emit 'data' to all sockets for the provided User or array of Users.
     * 
     * @param {*} users 
     * @param {*} channelName 
     * @param {*} data 
     */
    function emitToUsers(users, channelName, data) {
        const usersArray = Array.isArray(users) ? users : [users];
        usersArray.forEach((user) => {
            Object.keys(io.sockets.sockets).filter((key) => {
                return io.sockets.sockets[key].transomUser && io.sockets.sockets[key].transomUser._id.toString() === user._id.toString();
            }).forEach((socketKey) => {
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
        Object.keys(io.sockets.sockets).filter((key) => {
            return !!io.sockets.sockets[key].transomUser;
        }).forEach((socketKey) => {
            io.sockets.sockets[socketKey].emit(channelName, data);
        });
    }

    return {
        disconnectUsers,
        emitToUsers,
        emitToEveryone,
        // simple getter that allows access to io, while disallowing updates.
        get io() {
            return io;
        }
    };
};

module.exports = SocketioHandler;