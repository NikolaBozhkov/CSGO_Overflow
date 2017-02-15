"use strict";
let passport = require('passport'),
    path = require('path'),
    auth = require('./auth'),
    userController = require('../controllers/user.controller'),
    gameController = require('../controllers/game.controller'),
    itemsController = require('../controllers/items.controller'),
    dropperController = require('../controllers/dropper.controller'),
    session = require('express-session'),
    Restaurant = require('../models/restaurant');

module.exports = function(app) {
    app.get('/auth/steam', passport.authenticate('steam'), (req, res) => {
        // The request will be redirected to Steam for authentication, so
        // this function will not be called.
    });

    app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), userController.steamSuccessfulAuth);
    app.put('/putLogout', userController.logout);

    app.get('/getUsers', userController.getUsers);
    app.get('/getActiveUsers', userController.getActiveUsers);

    app.get('/getUser', auth.isAuthenticated, userController.getUser);

    app.get('/getItems', itemsController.getItems);

    //app.put('/attack/:userId', auth.isAuthenticated, gameController.attackUser);
    //app.put('/getDrops', auth.isAuthenticated, dropperController.getDrops);
    app.get('/adscend/:oid/:oname/:status/:userId/:currency/:ip/:hash', dropperController.adscendPostback);
    app.get('/offertoro/:oid/:oname/:userId/:currency/:sig', dropperController.offerToroPostback);
    app.get('/adgate/:oid/:oname/:status/:userId/:currency/:ip/:secret', dropperController.adgatePostback);
    app.get('/personaly/:oid/:oname/:userId/:currency/:hash', dropperController.personalyPostback);

    // app.put('/saveTradeUrl', auth.isAuthenticated, userController.putSaveTradeUrl);
    //
    // app.put('/checkout', auth.isAuthenticated, itemsController.putCheckout);
    //
    // app.put('/transferToActive', auth.isAuthenticated, userController.putTransferToActive);
    // app.put('/transferToStatic', auth.isAuthenticated, userController.putTransferToStatic);

    // app.all('/admin', (req, res) => {
    //     res.status(200).sendFile(path.resolve(__dirname, '../../client/admin/admin.html'));
    // })

    // app.all('/dropper', (req, res) => {
    //     res.status(200).sendFile(path.resolve(__dirname, '../../dist/assets/dropper.html'));
    // });

    app.all('*', (req, res) => {
        console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
        res.status(200).sendFile(path.resolve(__dirname, '../../dist/index.html'));
    });
}
