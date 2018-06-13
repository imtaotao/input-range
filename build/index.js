"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("./debug");
var expand_1 = require("./expand");
var event_1 = require("./event");
var utils_1 = require("./utils");
var Slide = (function () {
    function Slide(options) {
        this.version = 'v1.2.7';
        if (!options || typeof options !== 'object') {
            debug_1.warn(null, '【options】 must a object, detailed usage can be seen here. https://github.com/imtaotao/input-range');
        }
        if (!options.point) {
            debug_1.warn(null, '【options.point】 must a HTMLElement or query string');
        }
        if (utils_1.is_string(options.point)) {
            options.point = document.querySelector(options.point);
            !options.point && debug_1.warn(null, "Can't get HTMLElement from\u3010" + options.point + "\u3011");
        }
        this.onchange = function () { };
        this.oninput = function () { };
        this.onerror = function () { return false; };
        this.opts = {
            dom: options.point,
            limit_area: options.limit_area || 100,
            click_el_index: options.click_el_index || 0,
            expand_touch_dom: 0,
            prohibit_click: !!options.prohibit_click,
            prohibit_move: !!options.prohibit_move,
            start_xy: {
                x: 0,
                y: 0,
            }
        };
        this.opts.direction = options.direction
            ? options.direction.toLocaleLowerCase()
            : 'x';
        this.opts.pointer_events = !utils_1.is_undef(options.pointer_events)
            ? options.pointer_events
            : true;
        if (this.opts.direction !== 'x' && this.opts.direction !== 'y') {
            debug_1.warn(this, '【options direction】 must be x or y');
        }
        if (options.expand_touch_area && !utils_1.is_empty_obj(options.expand_touch_area)) {
            expand_1.expand_touch(this, options.point, options.expand_touch_area);
        }
        expand_1.init_default_style(this);
    }
    Slide.prototype.init = function () {
        event_1.init(this);
        return this;
    };
    Slide.prototype.dispatch = function (event_type, value, is_animate) {
        if (event_type !== 'input' && event_type !== 'change') {
            debug_1.warn(this, '【dispatch event type】must be "input" or "change"');
        }
        if (!utils_1.is_number(value) || value < 0 || value > 1) {
            debug_1.warn(this, '【dispatch value】 is not between 0 and 1');
        }
        event_1.dispatch(this, event_type, value, is_animate);
        return this;
    };
    Slide.prototype.prohibit_click = function (prohibit) {
        !utils_1.is_boolen(prohibit) && debug_1.warn(this, '【prohibit】 must be true or false');
        this.opts.prohibit_click = prohibit;
        return this;
    };
    Slide.prototype.prohibit_move = function (prohibit) {
        !utils_1.is_boolen(prohibit) && debug_1.warn(this, '【prohibit】 must be true or false');
        this.opts.prohibit_move = prohibit;
        return this;
    };
    return Slide;
}());
exports.Slide = Slide;
function createSlide(opts) {
    return new Slide(opts);
}
exports.createSlide = createSlide;
