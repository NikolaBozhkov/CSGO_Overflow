"use strict";
let config = require('../config/config'),
    request = require('request'),
    querystring = require('querystring'),
    Item = require('../models/item'),
    User = require('../models/user');

module.exports = {
    startUpdateInterval: function() {
        return setInterval(function() {
            module.exports.updateItems();
        }, 60000 * 60 * 12);
    },

    updateItems: function() {
        var url = querystring.stringify({ key: '57b173b1c4404555e954fe42', appid: '730' });

        request('http://backpack.tf/api/IGetMarketPrices/v1/?' + url, (err, res, bodyMarket) => {
            if (err) return console.log('failed to load market prices');
            console.log('backpack success');
            request('http://api.csgo.steamlytics.xyz/v1/items/?key=193fe438f1a783038b069027aafdc3fd', (err, res, bodyList) => {
                if (err) return console.log('failed to load items');
                console.log('steamlytics success');

                var marketItems = JSON.parse(bodyMarket).response.items;
                var infoItems = JSON.parse(bodyList).items;
                if (!marketItems || !infoItems) return;
                console.log('lists full');
                console.log(marketItems.length, infoItems.length);

                // TODO: switch to bot inventory
                // for every item of the db, update to the new price
                Item.find({}, function(err, items) {
                    if (err) throw err;
                    console.log('items success');

                    for (let item of items) {
                        var name = item.name + ' (' + item.wear + ')';
                        var infoItem = infoItems.find(item => item.market_name == name);
                        var newItem = marketItems[name];

                        if (newItem && infoItem) {
                            var stattrak = item.name.substr(0, 8) === 'StatTrak';
                            var rarity;
                            switch (infoItem.quality_color) {
                                case 'EB4B4B':
                                    rarity = 'ancient';
                                    break;
                                case 'D32CE6':
                                    rarity = 'legendary';
                                    break;
                                case '8847FF':
                                    rarity = 'mythical';
                                    break;
                                case '4B69FF':
                                    rarity = 'rare';
                                    break;
                                case '5E98D9':
                                    rarity = 'uncommon';
                                    break;
                                default:
                                    rarity = 'commmon';
                                    break;

                            }

                            item.update({
                                price: newItem.value * 100,
                                stattrak: stattrak ? 1 : 0,
                                rarity: rarity,
                                img: infoItem.icon_url,
                            }, (err) => {
                                if (err) console.log(err);
                                console.log('saved: ' + item.name);
                            });
                        }
                    }
                });
            });
        });
    },

    getItems: function(req, res) {
        Item.find({}, function(err, items) {
            if (err) return defaultErrHandle(req, res);

            res.json(items);
        });
    },

    putCheckout: function(req, res) {
        // Get db id of all selected items
        var itemsId = [];
        for (let item of req.body.items) {
            itemsId.push({
                _id: item._id
            });
        }

        // find the user for up to date version
        User.findOne({ id: req.decoded.id }, (err, user) => {
            if (err) return defaultErrHandle(err, res);

            // Get all items with the selected _id
            Item.find({ _id: {$in: itemsId} }, (err, items) => {
                if (err) return defaultErrHandle(err, res);

                let totalPrice = 0;
                for (let item of items) {
                    totalPrice += item.price;
                }

                // If user has enough drops send trade offer, otherwise respond with error
                if (user.staticCurrency >= totalPrice) {
                    user.staticCurrency -= totalPrice;
                    user.withdrawnAmount += totalPrice;
                    // TODO: send trade offer and check trade url
                } else {
                    let message = 'Not enough ' + (user.staticCurrency + user.activeCurrency >= totalPrice ? 'static ' : '') + 'drops';
                    return res.json({ success: 0, message: message });
                }
            });
        });
    },

    defaultErrHandle: function(err, res) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
