"use strict";
exports.dynamicSort = function (property, sortOrder) {
    if (sortOrder === void 0) { sortOrder = 1; }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
};
exports.formatNumber = function (num) {
    return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
};
exports.baseUrl = 'https://csgooverflow.com'; // 'http://192.168.1.12:3000';
//# sourceMappingURL=util.js.map