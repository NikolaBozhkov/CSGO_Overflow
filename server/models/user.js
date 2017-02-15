"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const EXP_SCALE = 0.0122;

// set up mongoose model
var userSchema = new Schema({
    name: String,
    id: String,
    tradeUrl: String,
    staticCurrency: Number,
    activeCurrency: Number,
    avatarUrl: String,
    level: Number,
    experienceTreshold: Number,
    experience: Number,
    wonAmount: Number,
    lostAmount: Number,
    wins: Number,
    losses: Number,
    referrer: String,
    referrals: Number,
    referralCurrency: Number,
    withdrawnAmount: Number,
    clearance: String,
    surveyLogs: [],
    flag: Number
}, { collection: 'users' });

userSchema.path('experience').set(function (newExperience) {
    // if being initialised
    if (this.experienceTreshold == 0) {
        this.experienceTreshold = Math.round(Math.pow((this.level + 1) / EXP_SCALE, 2));
    }

    // Level up as many levels as possible
    while (newExperience >= this.experienceTreshold) {
        this.level += 1;
        this.experienceTreshold = Math.round(Math.pow((this.level + 1) / EXP_SCALE, 2));
    }

    return newExperience;
});



module.exports = mongoose.model('User', userSchema);
