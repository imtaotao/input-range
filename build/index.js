import { warn } from './debug';
import { expand_touch, init_default_style } from './expand';
import { init, dispatch, } from './event';
import { is_undef, is_number, is_boolen, is_string, is_empty_obj, } from './utils';
var Slide = (function () {
    function Slide(options) {
        if (!options.point) {
            warn(null, '【options.point】 must a HTMLElement or query string');
        }
        if (is_string(options.point)) {
            options.point = document.querySelector(options.point);
            !options.point && warn(null, "Can't get HTMLElement from\u3010" + options.point + "\u3011");
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
        this.opts.pointer_events = !is_undef(options.pointer_events)
            ? options.pointer_events
            : true;
        if (this.opts.direction !== 'x' && this.opts.direction !== 'y') {
            warn(this, '【options direction】 must be x or y');
        }
        if (options.expand_touch_area && !is_empty_obj(options.expand_touch_area)) {
            expand_touch(this, options.point, options.expand_touch_area);
        }
        init_default_style(this);
    }
    Slide.prototype.init = function () {
        init(this);
        return this;
    };
    Slide.prototype.dispatch = function (event_type, value, is_animate) {
        if (event_type !== 'input' && event_type !== 'change') {
            warn(this, '【dispatch event type】must be "input" or "change"');
        }
        if (!is_number(value) || value < 0 || value > 1) {
            warn(this, '【dispatch value】 is not between 0 and 1');
        }
        dispatch(this, event_type, value, is_animate);
        return this;
    };
    Slide.prototype.prohibit_click = function (prohibit) {
        !is_boolen(prohibit) && warn(this, '【prohibit】 must be true or false');
        this.opts.prohibit_click = prohibit;
        return this;
    };
    Slide.prototype.prohibit_move = function (prohibit) {
        !is_boolen(prohibit) && warn(this, '【prohibit】 must be true or false');
        this.opts.prohibit_move = prohibit;
        return this;
    };
    return Slide;
}());
export { Slide };
export function createSlide(opts) {
    return new Slide(opts);
}
