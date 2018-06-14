function get_class_string(val) {
    return Object.prototype.toString.call(val);
}
export function is_empty_obj(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
export function bind(fn, ctx) {
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
export function random_num(min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100000; }
    return parseInt((Math.random() * (max - min + 1) + min));
}
export function is_undef(val) {
    return val === undefined || val === null;
}
export function is_string(string) {
    return get_class_string(string) === '[object String]';
}
export function is_number(number) {
    return get_class_string(number) === '[object Number]';
}
export function is_boolen(boolean) {
    return get_class_string(boolean) === '[object Boolean]';
}
