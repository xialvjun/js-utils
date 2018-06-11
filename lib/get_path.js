"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 简易版的 lodash.get 。。。因为有了个自己写的 set_path，对称？
 * @param obj
 * @param path
 * @param default_value
 */
function get_path(obj, path, default_value) {
    if (obj === undefined) {
        return default_value;
    }
    var paths = path;
    if (typeof path === 'string') {
        paths = path.split(/[\.\[\]\'\"]/g).filter(function (v) { return v !== ''; }).map(function (s) {
            var idx = parseInt(s);
            if ((idx > -1) && (idx + '' === s)) {
                return idx;
            }
            return s;
        });
    }
    if (paths.length === 0) {
        return obj;
    }
    var head = undefined;
    if (obj !== null) {
        head = obj[paths[0]];
    }
    return get_path(head, paths.slice(1), default_value);
}
exports.get_path = get_path;
