export var dynamicSort = function(property: string, sortOrder: number = 1) {
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export var formatNumber = function(num: number) {
    return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

export var baseUrl = 'https://csgooverflow.com'; //'http://192.168.1.12:3000';
