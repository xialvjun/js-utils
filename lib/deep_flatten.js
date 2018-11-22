"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deep_flatten(list) {
    list = [].concat(list);
    var length = 0;
    while (list.length !== length) {
        length = list.length;
        list = list.reduce(function (acc, cv) { return acc.concat(cv); }, []);
    }
    return list;
}
exports.deep_flatten = deep_flatten;
