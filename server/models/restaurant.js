"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// set up mongoose model
var restaurantSchema = new Schema({
    id: String,
    categories: [{
        name: String,
        imageUrl: String,
        menuItems: [{
            name: String,
            imageUrl: String,
            price: Number,
            ingredients: [String]
        }]
    }]
}, { collection: 'restaurants' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
