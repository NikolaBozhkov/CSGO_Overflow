"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// set up mongoose model
var itemSchema = new Schema({
    name: String,
    wear: String,
    rarity: String,
    stattrak: Boolean,
    price: Number,
    img: String
}, { collection: 'items' });

module.exports = mongoose.model('Item', itemSchema);
