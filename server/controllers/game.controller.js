"use strict";
let User = require('../models/user'),
    userController = require('./user.controller'),
    io = require('../config/socket').io,
    Chance = require('chance'),
    winston = require('winston');

let chance = new Chance();

module.exports = {
    attackUser: function (req, res) {
        // Check if targeting self
        if (req.decoded.id == req.params.userId) {
            return res.status(400).json({message: 'Cannot attack self.'});
        }

        let amount = Math.round(req.body.amount);
        if (amount < 10) {
            return res.status(400).json({message: 'Amount must be above 10.'});
        }

        userController.loadAllUsers((err, users, usersIndex) => {
            if (err) return userController.defaultErrHandle(err, res);

            let attacker = usersIndex[req.decoded.id];
            let attacked = usersIndex[req.params.userId];
            let attackerCopy = userController.copyUser(attacker);
            let attackedCopy = userController.copyUser(attacked);

            if (attacker && attacked) {
                // Check if users are flagged
                if (attacked.flag || attacker.flag) {
                    return res.status(400).json({ message: 'One of the users is flagged for suspicious behavior' });
                }

                // Check if amount of greater than 50% of user's active currency
                if (amount > attacked.activeCurrency / 2) {
                    return res.status(400).json({message: 'Invalid amount. Amount cannot exceed 50% of active user currency'});
                }

                // Check if user has enough active currency
                if (amount > attacker.activeCurrency) {
                    return res.status(400).json({message: 'Invalid amount. Amount cannot exceed active currency'});
                }

                // Check which user wins the duel and update the active currency
                let won = chance.bool();
                if (won) {
                    attackerCopy.activeCurrency += amount;
                    attackedCopy.activeCurrency -= amount;
                    attackerCopy.wonAmount += amount;
                    attackedCopy.lostAmount += amount;
                    attackerCopy.wins += 1;
                    attackedCopy.losses += 1;
                } else {
                    attackerCopy.activeCurrency -= amount;
                    attackedCopy.activeCurrency += amount;
                    attackerCopy.lostAmount += amount;
                    attackedCopy.wonAmount += amount;
                    attackerCopy.losses += 1;
                    attackedCopy.wins += 1;
                }

                let oldAttackerLevel = attackerCopy.level;
                let oldAttackedLevel = attackedCopy.level;
                attackerCopy.experience += amount;
                attackedCopy.experience += amount;

                // Update referrals is any and level 3
                if (attacker.referrer != '0' && attackerCopy.level == 3 && attackerCopy.level != oldAttackerLevel) {
                    userController.rewardReferrer(attacker.referrer);
                }

                if (attacked.referrer != '0' && attackedCopy.level == 3 && attackedCopy.level != oldAttackedLevel) {
                    userController.rewardReferrer(attacked.referrer);
                }

                // send res after both users are saved
                var copy = [attackerCopy, attackedCopy];
                var local = [attacker, attacked];
                var counter = 0;

                for (let i = 0; i < 2; i++) {
                    // Update attack results
                    let fields = {
                        activeCurrency: copy[i].activeCurrency,
                        wonAmount: copy[i].wonAmount,
                        lostAmount: copy[i].lostAmount,
                        wins: copy[i].wins,
                        losses: copy[i].losses,
                        experience: copy[i].experience,
                        level: copy[i].level,
                        experienceTreshold: copy[i].experienceTreshold
                    }

                    local[i].update(fields, (err) => {
                        if (err) return module.exports.attackErrorHandler(err, res, doc, attacker.id, attacked.id, won, amount);

                        module.exports.updateAttackLocalUser(local[i], copy[i]);
                        counter += 1;
                        if (counter == 2) {
                            //Notify the attacked person if online
                            var data = {
                                won: !won,
                                amount: amount,
                                user: attacked,
                                attacker: userController.createPublicUser(attacker)
                            };

                            userController.emitDataToOnlineUser('attacked', data, attacked.id);
                            return res.json({
                                won: won,
                                attacker: attacker,
                                attacked: userController.createPublicUser(attacked),
                                expGained: amount
                            });
                        }
                    });
                }
            } else {
                return res.status(404).json({ msg: 'One of the users could not be found!' });
            }
        });
    },

    updateAttackLocalUser(localUser, newUser) {
        localUser.activeCurrency = newUser.activeCurrency;
        localUser.wonAmount = newUser.wonAmount;
        localUser.lostAmount = newUser.lostAmount;
        localUser.wins = newUser.wins;
        localUser.losses = newUser.losses;
        localUser.experience = newUser.experience;
        localUser.level = newUser.level;
        localUser.experienceTreshold = newUser.experienceTreshold;
    },

    attackErrorHandler: function (err, res, doc, attackerId, attackedId, won, amount) {
        winston.log('attack_failed', 'failed to save: ' + doc.id + ' attacker: ' + attackerId + ' attacked: ' + attackedId + ' won: ' + won + ' amount: ' + amount);
        return res.status(500).json({ message: err.message });
    }
}
