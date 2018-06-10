import { warn } from './debug';
import { is_undef, is_number, } from './utils';
import { get_width } from './compute';
export function init_default_style(ctx) {
    var _a = ctx.opts, dom = _a.dom, pointer_events = _a.pointer_events, click_el_index = _a.click_el_index;
    var parent = dom.parentElement;
    var is_range_err = click_el_index < 0 ||
        click_el_index > parent.parentElement.childElementCount - 1;
    if (is_range_err) {
        warn(ctx, '【click_el_index】 is not in the correct range');
    }
    if (pointer_events) {
        dom.style.pointerEvents = 'auto';
        parent.style.pointerEvents = 'none';
    }
    var position = getComputedStyle(parent).position;
    if (position === 'static') {
        dom.style.position = 'relative';
        return;
    }
    dom.style.position = 'absolute';
}
export function expand_touch(ctx, el, area) {
    var _a = check_and_respose(ctx, area), dom = _a.dom, parent = _a.parent, css_text = _a.css_text, expand_div = _a.expand_div;
    var first = true;
    watch_dom_display(dom, function (_a) {
        var old_display = _a.old_display;
        old_display = (/^display:([^;]+)/.exec(old_display) || [])[1];
        if (old_display) {
            expand_div.style.display = old_display.trim() === 'none' && !first
                ? 'block'
                : 'none';
            first = false;
        }
    });
    expand_div.style.cssText = css_text;
    dom.style.zIndex = '999';
    parent.appendChild(expand_div);
    ctx.opts.expand_touch_dom = expand_div;
}
function check_and_respose(ctx, _a) {
    var width = _a.width, height = _a.height;
    is_undef(width) && warn(ctx, 'Missing attribute【width】in expand_touch_area');
    is_undef(height) && warn(ctx, 'Missing attribute【height】in expand_touch_area');
    is_number(width) && (width += 'px');
    is_number(height) && (height += 'px');
    var _b = ctx.opts, dom = _b.dom, direction = _b.direction;
    var point_width_half = get_width(dom) / 2;
    var css_text = "width:" + width + "; height:" + height + ";" +
        'position:absolute;' +
        'pointer-events:auto;' +
        'z-index:998;' +
        (direction === 'x'
            ? "top:calc(50% - " + height + " / 2); right:calc(-" + width + " / 2 + " + point_width_half + "px);"
            : "top:calc(-" + height + " / 2); left:calc(50% - " + width + " / 2);");
    return {
        dom: dom,
        css_text: css_text,
        parent: dom.parentElement,
        expand_div: document.createElement('div'),
    };
}
function watch_dom_display(dom, callback) {
    var observer = createMutationObserver(function (mutations) {
        callback(mutations[0]);
    });
    observer.observe(dom, { attributes: true, attributeOldValue: true });
}
var createMutationObserver = (function () {
    var M = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (M.bind.apply(M, [void 0].concat(args)))();
    };
})();
