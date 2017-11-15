"use strict";
const debug = require('debug')('transomjs:socket-io-internal');
const expect = require('chai').expect;
const sinon = require('sinon');
const SocketioHandler = require('../lib/socket-io-handler');
const PocketRegistry = require('pocket-registry');
const TransomSocketIOInternal = require('../index');


describe('SocketIOHandler', function (done) {

    const server = {};

    before(function () {
        
        server.registry = new PocketRegistry();

        const options = {};
        const restifyApp = {};
        TransomSocketIOInternal.initialize(server, options);
        TransomSocketIOInternal.initializeWithServer(restifyApp);
    });

    it('has been registered with the server', function () {
        const msgClient = server.registry.get('messageClient');
        expect(msgClient).to.be.an.instanceOf(Object);
        // expect(nonceHandler.createNonce).to.be.an.instanceOf(Function);
        // expect(nonceHandler.verifyNonce).to.be.an.instanceOf(Function);
    });

});