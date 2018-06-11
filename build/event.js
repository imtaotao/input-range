"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var compute_1 = require("./compute");
function init(ctx) {
    remove_init_event(ctx);
    var _a = ctx.opts, dom = _a.dom, expand_touch_dom = _a.expand_touch_dom;
    var parent = dom.parentElement;
    var grandpa = parent.parentElement;
    var init_event_fn = utils_1.bind(mousedown, ctx);
    var now_percentage = compute_1.get_now_percentage(ctx, parent);
    var revise_width = compute_1.get_width(dom) / 2;
    var revise_height = compute_1.get_height(dom) / 2;
    var total_x = compute_1.get_width(grandpa);
    var total_y = compute_1.get_height(grandpa);
    var last_x = total_x * (1 - now_percentage);
    var last_y = total_y * (1 - now_percentage);
    var click_instance = set_click_position(ctx, parent);
    ctx.value = now_percentage;
    dom.onmousedown = init_event_fn;
    dom.addEventListener('touchstart', init_event_fn);
    if (expand_touch_dom) {
        expand_touch_dom.onmousedown = init_event_fn;
        expand_touch_dom.addEventListener('touchstart', init_event_fn);
    }
    ctx.opts = __assign({}, ctx.opts, { parent: parent,
        total_x: total_x,
        total_y: total_y,
        revise_height: revise_height,
        revise_width: revise_width,
        last_x: last_x,
        last_y: last_y,
        now_percentage: now_percentage,
        init_event_fn: init_event_fn,
        click_instance: click_instance });
}
exports.init = init;
function mousedown(e) {
    if (this.opts.prohibit_move) {
        return;
    }
    var ctx = this;
    var _a = compute_1.get_client_xy(e), x = _a.x, y = _a.y;
    var _b = ctx.opts, dom = _b.dom, click_instance = _b.click_instance;
    var touchmove = utils_1.bind(mousemove, ctx);
    click_instance.remove();
    ctx.opts.start_xy.x = x - dom.offsetLeft;
    ctx.opts.start_xy.y = y - dom.offsetTop;
    if (e.type !== 'touchstart') {
        document.onmousemove = utils_1.bind(mousemove, ctx);
        document.onmouseup = function (e) {
            !ctx.opts.prohibit_move && dispatch(ctx, 'change', ctx.value);
            document.onmousemove = null;
            document.onmouseup = null;
            mouseup_touchend_hook(ctx, e);
        };
        return;
    }
    document.addEventListener('touchmove', touchmove);
    document.addEventListener('touchend', touchend);
    function touchend(e) {
        !ctx.opts.prohibit_move && dispatch(ctx, 'change', ctx.value);
        document.removeEventListener('touchmove', touchmove);
        document.removeEventListener('touchend', touchend);
        mouseup_touchend_hook(ctx, e);
    }
}
exports.mousedown = mousedown;
function mousemove(e) {
    if (this.opts.prohibit_move) {
        return;
    }
    var ctx = this;
    var is_phone = e.type === 'touchmove';
    !is_phone && e.preventDefault();
    var _a = ctx.opts, total_x = _a.total_x, total_y = _a.total_y, revise_height = _a.revise_height, revise_width = _a.revise_width, last_y = _a.last_y, direction = _a.direction;
    var start_xy = ctx.opts.start_xy;
    var _b = compute_1.get_client_xy(e), x = _b.x, y = _b.y;
    var left = x - start_xy.x;
    var top = y - start_xy.y;
    if (direction === 'x') {
        var max = total_x - revise_width;
        var min = -revise_width;
        left = Math.max(Math.min(left, max), min);
    }
    if (direction === 'y') {
        var normal_y = total_y - last_y;
        var max = normal_y - revise_height / 2;
        var min = -(last_y + revise_height / 2);
        top = Math.max(Math.min(top, max), min);
    }
    var precent = compute_1.get_percent(ctx, left, top);
    !utils_1.is_undef(precent) && dispatch(ctx, 'input', precent);
}
exports.mousemove = mousemove;
function mouseup_touchend_hook(ctx, e) {
    var _a = ctx.opts, total_x = _a.total_x, total_y = _a.total_y, parent = _a.parent;
    var now_percentage = compute_1.get_now_percentage(ctx, parent);
    var time = e.type === 'touchend' ? 15 : 0;
    ctx.opts.last_x = total_x * (1 - now_percentage);
    ctx.opts.last_y = total_y * (1 - now_percentage);
    setTimeout(function () {
        set_click_position(ctx, parent);
    }, time);
}
exports.mouseup_touchend_hook = mouseup_touchend_hook;
function dispatch(ctx, event_type, precent, is_animate) {
    var parent = ctx.opts.parent;
    if (is_animate) {
        parent.style.transition = 'all 0.2s ease';
        setTimeout(function () { return parent.style.transition = ''; }, 205);
    }
    compute_1.alter_slider_bar(ctx, precent);
    ctx.value = precent;
    var event = new Event(event_type);
    event.value = precent;
    parent.dispatchEvent(event);
    ctx['on' + event_type](precent, parent, ctx);
}
exports.dispatch = dispatch;
function set_click_position(ctx, parent) {
    var _a = ctx.opts, direction = _a.direction, click_el_index = _a.click_el_index;
    var sibling = parent.parentElement.children[click_el_index];
    var random_number;
    if (sibling) {
        sibling.onclick = function (event) {
            if (ctx.opts.prohibit_click) {
                return;
            }
            var self_random_num = random_number = utils_1.random_num();
            var layerX = event.layerX, layerY = event.layerY;
            var precent = direction === 'x'
                ? layerX / compute_1.get_width(sibling)
                : 1 - layerY / compute_1.get_height(sibling);
            dispatch(ctx, 'change', precent, true);
            setTimeout(function () {
                if (self_random_num !== random_number) {
                    return;
                }
                init(ctx);
            }, 200);
        };
        return {
            remove: function () {
                sibling.onclick = null;
            }
        };
    }
    return { remove: function () { } };
}
exports.set_click_position = set_click_position;
function remove_init_event(ctx) {
    var _a = ctx.opts, dom = _a.dom, init_event_fn = _a.init_event_fn, expand_touch_dom = _a.expand_touch_dom;
    if (!init_event_fn) {
        return;
    }
    dom.onmousedown = null;
    dom.removeEventListener('touchstart', init_event_fn);
    if (expand_touch_dom) {
        expand_touch_dom.onmousedown = null;
        expand_touch_dom.removeEventListener('touchstart', init_event_fn);
    }
}
