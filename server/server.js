"use strict";
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var config = require('./config/config');

var mongoose = require('mongoose');
mongoose.connect(config.database);

require('./config/socket').init(server);
require('./config/socketEvents')();
require('./config/express')(app, config);
require('./config/passport')();
require('./config/routes')(app);
//require('./config/steam.bot')();

var itemsController = require('./controllers/items.controller');
var User = require('./models/user');
var Item = require('./models/item');
var Restaurant = require('./models/restaurant');

var test = "test";

server.listen(config.port, () => {
    console.log('listening on port ' + config.port);

    // var restaurant = new Restaurant({
    //     id: 'somelongassidhere',
    //     categories: []
    // });
    //
    // var imageUrl = "verylongimageurlverylongimageurlverylongimageurlverylongimageurlverylongimageurlverylongimageurlverylongimageurlverylongimageurlverylongimageurlverylongimageurlverylongimageurl";
    // for (var i = 0; i < 20; i++) {
    //     var category = {
    //         name: "Some Category name",
    //         imageUrl: imageUrl,
    //         menuItems: []
    //     };
    //
    //     for (var j = 0; j < 40; j++) {
    //         var ingredients = [];
    //         for (var k = 0; k < 10; k++) {
    //             ingredients.push("here is some long ingredient");
    //         }
    //
    //         category.menuItems.push({
    //             name: "Some meal's name here",
    //             imageUrl: imageUrl,
    //             price: 100,
    //             ingredients: ingredients
    //         });
    //     }
    //
    //     restaurant.categories.push(category);
    // }
    //
    // restaurant.save((err) => {
    //     if (err) throw err;
    //     console.log('added success');
    // });

    //itemsController.updateItems();

    // User.find({}, (err, users) => {
    //     var total = 0;
    //     var totalBuy = 0;
    //     for(let user of users) {
    //         // total += user.level;
    //         // if (user.level != 0) {
    //         //     console.log(user.level);
    //         // }
    //         var userTotal = user.staticCurrency + user.activeCurrency;
    //         var generated = user.lostAmount - user.wonAmount + userTotal - user.referralCurrency;
    //         //total += generated;
    //
    //         if (userTotal > 29000) {
    //             totalBuy += userTotal;
    //             total += generated;
    //             console.log(user.name + ' -- ' + (userTotal));
    //         }
    //
    //         if (user.flag) {
    //             console.log(user.name + ' FLAG!');
    //             console.log(user.surveyLogs);
    //         }
    //
    //         // user.experienceTreshold = 0;
    //         // user.level = 0;
    //         // user.experience = user.experience;
    //         //
    //         // user.update({ experience: user.experience, level: user.level, experienceTreshold: user.experienceTreshold }, (err) => {});
    //     }
    //
    //     console.log(total / 10000);
    //     //console.log(total / users.length);
    // });

    // TODO: Get bot inventory, check price and save to db
    // https://steamcommunity-a.akamaihd.net/economy/image/
    // http://steamcommunity.com/profiles/76561198061679866/inventory/json/730/2
    var interval = itemsController.startUpdateInterval();
});

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//     next()
// })
