import { warn } from './debug';
import { is_undef, is_number, } from './utils';
import { get_width } from './compute';
export function init_default_style(ctx) {
    const { dom, pointer_events, click_el_index } = ctx.opts;
    const parent = dom.parentElement;
    const is_range_err = click_el_index < 0 ||
        click_el_index > parent.parentElement.childElementCount - 1;
    if (pointer_events) {
        dom.style.pointerEvents = 'auto';
        parent.style.pointerEvents = 'none';
    }
    if (is_range_err) {
        warn('【click_el_index】 is not in the correct range');
    }
    const position = getComputedStyle(parent).position;
    if (position === 'static') {
        dom.style.position = 'relative';
        return;
    }
    dom.style.position = 'absolute';
}
export function expand_touch(ctx, el, area) {
    const { dom, parent, css_text, expand_div } = check_and_respose(ctx, area);
    let first = true;
    watch_dom_display(dom, ({ old_display }) => {
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
function check_and_respose(ctx, { width, height }) {
    is_undef(width) && warn('Missing attribute【width】in expand_touch_area');
    is_undef(height) && warn('Missing attribute【height】in expand_touch_area');
    is_number(width) && (width += 'px');
    is_number(height) && (height += 'px');
    const { dom, direction } = ctx.opts;
    const point_width_half = get_width(dom) / 2;
    const css_text = `width:${width}; height:${height};` +
        'position:absolute;' +
        'pointer-events:auto;' +
        'z-index:998;' +
        (direction === 'x'
            ? `top:calc(50% - ${height} / 2); right:calc(-${width} / 2 + ${point_width_half}px);`
            : `top:calc(-${height} / 2); left:calc(50% - ${width} / 2);`);
    return {
        dom,
        css_text,
        parent: dom.parentElement,
        expand_div: document.createElement('div'),
    };
}
function watch_dom_display(dom, callback) {
    const observer = createMutationObserver((mutations) => {
        callback(mutations[0]);
    });
    observer.observe(dom, { attributes: true, attributeOldValue: true });
}
const createMutationObserver = (() => {
    const M = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
    return (...args) => new M(...args);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL2V4cGFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRS9CLE9BQU8sRUFFTCxRQUFRLEVBQ1IsU0FBUyxHQUNWLE1BQU0sU0FBUyxDQUFDO0FBQ2pCLE9BQU8sRUFBRSxTQUFTLEVBQWMsTUFBTSxXQUFXLENBQUM7QUFFbEQsTUFBTSw2QkFBOEIsR0FBUztJQUMzQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ3hELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUE0QixDQUFDO0lBQ2hELE1BQU0sWUFBWSxHQUFHLGNBQWMsR0FBRyxDQUFDO1FBQ2xCLGNBQWMsR0FBUyxNQUFNLENBQUMsYUFBYyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztJQUV4RixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztRQUNqQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7SUFDdEMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUNuRCxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxQixHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUE7UUFDL0IsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFB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