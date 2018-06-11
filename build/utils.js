"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get_class_string(val) {
    return Object.prototype.toString.call(val);
}
function is_empty_obj(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
exports.is_empty_obj = is_empty_obj;
function bind(fn, ctx) {
    function bound_fn(a) {
        var l = arguments.length;
        return l
            ? l > 1
                ? fn.apply(ctx, arguments)
                : fn.call(ctx, a)
            : fn.call(ctx);
    }
    bound_fn._length = fn.length;
    return bound_fn;
}
exports.bind = bind;
function random_num(min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100000; }
    return parseInt((Math.random() * (max - min + 1) + min));
}
exports.random_num = random_num;
function is_undef(val) {
    return val === undefined || val === null;
}
exports.is_undef = is_undef;
function is_string(string) {
    return get_class_string(string) === '[object String]';
}
exports.is_string = is_string;
function is_number(number) {
    return get_class_string(number) === '[object Number]';
}
exports.is_number = is_number;
function is_boolen(boolean) {
    return get_class_string(boolean) === '[object Boolean]';
}
exports.is_boolen = is_boolen;
