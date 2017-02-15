"use strict";
var User = (function () {
    function User(user) {
        this.id = user.id;
        this.name = user.name;
        this.tradeUrl = user.tradeUrl;
        this.staticCurrency = user.staticCurrency;
        this.activeCurrency = user.activeCurrency;
        this.avatarUrl = user.avatarUrl;
        this.level = user.level;
        this.experienceTreshold = user.experienceTreshold;
        this.experience = user.experience;
        this.wonAmount = user.wonAmount;
        this.lostAmount = user.lostAmount;
        this.name = user.name;
        this.wins = user.wins;
        this.losses = user.losses;
    }
    User.prototype.getPreviousExpTreshold = function () {
        return (Math.pow(this.level, 2) * this.experienceTreshold) / Math.pow(this.level + 1, 2);
    };
    User.prototype.getExperienceDifference = function () {
        return this.experienceTreshold - this.getPreviousExpTreshold();
    };
    User.prototype.getExperiencePercent = function () {
        var currExpOfLvl = this.experience - this.getPreviousExpTreshold();
        return this.getExpAsPercentOfDifference(currExpOfLvl);
    };
    User.prototype.getExpAsPercentOfDifference = function (experience) {
        return Math.round(experience / this.getExperienceDifference() * 100);
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.model.js.map