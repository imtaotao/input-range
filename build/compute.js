export function get_now_percentage(ctx, parent) {
    var direction = ctx.opts.direction;
    var grandfather = parent.parentElement;
    return direction === 'x'
        ? get_width(parent) / get_width(grandfather)
        : get_height(parent) / get_height(grandfather);
}
export function get_width(dom) {
    return parseInt(getComputedStyle(dom).width);
}
export function get_height(dom) {
    return parseInt(getComputedStyle(dom).height);
}
export function get_client_xy(e) {
    var type = e.type.includes('touch');
    var x = type
        ? e.changedTouches[0].clientX
        : e.clientX;
    var y = type
        ? e.changedTouches[0].clientY
        : e.clientY;
    return { x: x, y: y };
}
export function get_percent(ctx, left, top) {
    var _a = ctx.opts, total_x = _a.total_x, total_y = _a.total_y, revise_height = _a.revise_height, revise_width = _a.revise_width, direction = _a.direction, last_y = _a.last_y, limit_area = _a.limit_area;
    var is_normal_val = function (val) { return val > -limit_area && val < limit_area; };
    if (direction === 'x' && is_normal_val(top)) {
        var nowVal = left + revise_width;
        return nowVal / total_x;
    }
    if (direction === 'y' && is_normal_val(left)) {
        var normal_y = total_y - last_y - revise_height / 2;
        return (normal_y - top) / total_y;
    }
}
export function alter_slider_bar(ctx, precent) {
    var _a = ctx.opts, parent = _a.parent, direction = _a.direction;
    var attr = direction === 'x' ? 'width' : 'height';
    parent.style[attr] = precent * 100 + '%';
}
