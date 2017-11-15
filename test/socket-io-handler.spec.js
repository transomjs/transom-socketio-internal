"use strict";
const debug = require('debug')('transomjs:socket-io-internal');
const expect = require('chai').expect;
const sinon = require('sinon');
const SocketioHandler = require('../lib/socket-io-handler');
const MockIOServerFactory = require('socket-io-mocks').server;
const PocketRegistry = require('pocket-registry');
const TransomSocketIOInternal = require('../index');


describe('SocketIOHandler', function (done) {

    const server = {};
    let localMiddle;
    let ioServer;
    let testSocket;

    beforeEach(function setupMockIOServer() {
        //Creates a fresh Server class. The return value is equavalent to require('socket.io'). 
        const IOServer = MockIOServerFactory();
        ioServer = new IOServer() /*this is a sinon spy*/
        let handler = sinon.spy();
        ioServer.on('connection', handler);
        ioServer.use = sinon.spy(function (middle) {
            localMiddle = middle;
        });
        testSocket = ioServer._connect();
        expect(handler.calledWith(testSocket)).to.be.true;

        ioServer.sockets = ioServer.sockets || {};
        ioServer.sockets.sockets = ioServer.sockets.sockets || [testSocket];
        testSocket.transomUser = { _id: 'testUser' };
    });

    beforeEach(function () {

        server.registry = new PocketRegistry();
        const options = {};
        const restifyApp = {};
        TransomSocketIOInternal.initialize(server, options);
        TransomSocketIOInternal.initializeWithServer(restifyApp, ioServer);
    });

    it('has been registered with the server', function () {
        const msgClient = server.registry.get('transomMessageClient');
        expect(msgClient).to.be.an.instanceOf(Object);
        expect(msgClient.emitToUsers).to.be.an.instanceOf(Function);
        expect(msgClient.emitToEveryone).to.be.an.instanceOf(Function);
    });

    it('can emit a message to specific connected users', function () {
        const msgClient = server.registry.get('transomMessageClient');
        msgClient.emitToUsers([{ _id: 'testUser' }], 'testChannel', { foo: 'bar' });
        expect(testSocket.emit).to.be.an.instanceOf(Function);
        //console.log('args', testSocket.emit.getCall(0).args);
        expect(testSocket.emit.calledWith('testChannel', { foo: 'bar' })).to.be.true;
    });

    it('can emit a message to all connected users', function () {
        const msgClient = server.registry.get('transomMessageClient');
        msgClient.emitToEveryone('testChannel', { foo: 'barAll' });
        expect(testSocket.emit).to.be.an.instanceOf(Function);
        //console.log('args', testSocket.emit.getCall(0).args);
        expect(testSocket.emit.calledWith('testChannel', { foo: 'barAll' })).to.be.true;
    });

});