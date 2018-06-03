import { bind, random_num, is_undef } from './utils';
import { get_width, get_height, get_percent, get_client_xy, alter_slider_bar, get_now_percentage, } from './compute';
export function init(ctx) {
    remove_init_event(ctx);
    const { dom, direction, click_el_index, expand_touch_dom } = ctx.opts;
    const parent = dom.parentElement;
    const grandpa = parent.parentElement;
    const init_event_fn = bind(mousedown, ctx);
    const now_percentage = get_now_percentage(ctx, parent);
    const revise_width = get_width(dom) / 2;
    const revise_height = get_height(dom) / 2;
    const total_x = get_width(grandpa);
    const total_y = get_height(grandpa);
    const last_x = total_x * (1 - now_percentage);
    const last_y = total_y * (1 - now_percentage);
    const click_instance = set_click_position(ctx, parent);
    ctx.value = now_percentage;
    dom.onmousedown = init_event_fn;
    dom.addEventListener('touchstart', init_event_fn);
    if (expand_touch_dom) {
        expand_touch_dom.onmousedown = init_event_fn;
        expand_touch_dom.addEventListener('touchstart', init_event_fn);
    }
    ctx.opts = Object.assign({}, ctx.opts, { parent,
        total_x,
        total_y,
        revise_height,
        revise_width,
        last_x,
        last_y,
        now_percentage,
        init_event_fn,
        click_instance });
}
export function mousedown(e) {
    if (this.opts.prohibit_move) {
        return;
    }
    const ctx = this;
    const { x, y } = get_client_xy(e);
    const { dom, parent, click_instance } = ctx.opts;
    const touchmove = bind(mousemove, ctx);
    click_instance.remove();
    ctx.opts.start_xy.x = x - dom.offsetLeft;
    ctx.opts.start_xy.y = y - dom.offsetTop;
    if (e.type !== 'touchstart') {
        document.onmousemove = bind(mousemove, ctx);
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
export function mousemove(e) {
    if (this.opts.prohibit_move) {
        return;
    }
    const ctx = this;
    const is_phone = e.type === 'touchmove';
    !is_phone && e.preventDefault();
    const { dom, parent, total_x, total_y, revise_height, revise_width, last_y, direction, } = ctx.opts;
    const start_xy = ctx.opts.start_xy;
    const { x, y } = get_client_xy(e);
    let left = x - start_xy.x;
    let top = y - start_xy.y;
    if (direction === 'x') {
        const max = total_x - revise_width;
        const min = -revise_width;
        left = Math.max(Math.min(left, max), min);
    }
    if (direction === 'y') {
        const normal_y = total_y - last_y;
        const max = normal_y - revise_height / 2;
        const min = -(last_y + revise_height / 2);
        top = Math.max(Math.min(top, max), min);
    }
    const precent = get_percent(ctx, left, top);
    !is_undef(precent) && dispatch(ctx, 'input', precent);
}
export function mouseup_touchend_hook(ctx, e) {
    const { total_x, total_y, parent } = ctx.opts;
    const now_percentage = get_now_percentage(ctx, parent);
    const time = e.type === 'touchend' ? 15 : 0;
    ctx.opts.last_x = total_x * (1 - now_percentage);
    ctx.opts.last_y = total_y * (1 - now_percentage);
    setTimeout(() => {
        set_click_position(ctx, parent);
    }, time);
}
export function dispatch(ctx, event_type, precent) {
    alter_slider_bar(ctx, precent);
    ctx.value = precent;
    const parent = ctx.opts.parent;
    const event = new Event(event_type);
    event.value = precent;
    parent.dispatchEvent(event);
    ctx['on' + event_type](precent, parent, ctx);
}
export function set_click_position(ctx, parent) {
    const { direction, click_el_index } = ctx.opts;
    const sibling = parent.parentElement.children[click_el_index];
    let random_number;
    if (sibling) {
        sibling.onclick = (event) => {
            if (ctx.opts.prohibit_click) {
                return;
            }
            const self_random_num = random_number = random_num();
            const { layerX, layerY } = event;
            const precent = direction === 'x'
                ? layerX / get_width(sibling)
                : 1 - layerY / get_height(sibling);
            parent.style.transition = 'all 0.2s ease';
            dispatch(ctx, 'change', precent);
            setTimeout(() => {
                if (self_random_num !== random_number) {
                    return;
                }
                parent.style.transition = '';
                init(ctx);
            }, 205);
        };
        return {
            remove() {
                sibling.onclick = null;
            }
        };
    }
    return { remove() { } };
}
function remove_init_event(ctx) {
    const { dom, init_event_fn, expand_touch_dom } = ctx.opts;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3JELE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGtCQUFrQixHQUNuQixNQUFNLFdBQVcsQ0FBQztBQVFuQixNQUFNLGVBQWdCLEdBQVM7SUFFN0IsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztJQUN0RSxNQUFNLE1BQU0sR0FBZ0IsR0FBRyxDQUFDLGFBQWEsQ0FBQztJQUM5QyxNQUFNLE9BQU8sR0FBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUNsRCxNQUFNLGFBQWEsR0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUV2RCxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFMUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUdwQyxNQUFNLE1BQU0sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUM7SUFDOUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDO0lBRTlDLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2RCxHQUFHLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztJQUczQixHQUFHLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQztJQUNoQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBR2xELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUNyQixnQkFBZ0IsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDO1FBQzdDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQUkscUJBQ0gsR0FBRyxDQUFDLElBQUksSUFDWCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxhQUFhO1FBQ2IsWUFBWTtRQUNaLE1BQU07UUFDTixNQUFNO1FBQ04sY0FBYztRQUNkLGFBQWE7UUFDYixjQUFjLEdBQ2YsQ0FBQTtBQUNILENBQUM7QUFFRCxNQUFNLG9CQUFxQixDQUFTO0lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQztJQUFDLENBQUM7SUFDeEMsTUFBTSxHQUFHLEdBQVMsSUFBSSxDQUFDO0lBQ3ZCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDakQsTUFBTSxTQUFTLEdBQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUczQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO0lBQ3pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUV4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDNUIsUUFBUSxDQUFDLFdBQVcsR0FBUyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBRSxDQUFDO1FBQ25ELFFBQVEsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFZO1lBQ3pDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELFFBQVEsQ0FBQyxXQUFZLEdBQUcsSUFBSSxDQUFDO1lBQzdCLFFBQVEsQ0FBQyxTQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFDRCxNQUFNLENBQUM7SUFDVCxDQUFDO0lBR0QsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELGtCQUFtQixDQUFZO1FBQzdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckQsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRCxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztBQUNILENBQUM7QUFHRCxNQUFNLG9CQUFxQixDQUFTO0lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQztJQUFDLENBQUM7SUFDeEMsTUFBTSxHQUFHLEdBQVMsSUFBSSxDQUFDO0lBQ3ZCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDO0lBQ3hDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUVoQyxNQUFNLEVBQ0YsR0FBRyxFQUNILE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxFQUNQLGFBQWEsRUFDYixZQUFZLEVBQ1osTUFBTSxFQUNOLFNBQVMsR0FDWixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDYixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsQyxJQUFJLElBQUksR0FBVSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLEdBQUcsR0FBVSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUdoQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEdBQUcsR0FBRyxPQUFPLEdBQUcsWUFBWSxDQUFDO1FBQ25DLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO1FBQzFCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLFFBQVEsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLFFBQVEsR0FBRyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1QyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRUQsTUFBTSxnQ0FBa0MsR0FBUyxFQUFFLENBQVM7SUFDMUQsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztJQUM5QyxNQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLEVBQWUsTUFBTSxDQUFDLENBQUM7SUFDcEUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQztJQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUM7SUFHakQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLGtCQUFrQixDQUFDLEdBQUcsRUFBZSxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQsTUFBTSxtQkFBb0IsR0FBUyxFQUFFLFVBQWlCLEVBQUUsT0FBYztJQUVwRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0IsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7SUFHcEIsTUFBTSxNQUFNLEdBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbkMsTUFBTSxLQUFLLEdBQWdCLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBR2pELEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ3RCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFFRCxNQUFNLDZCQUE4QixHQUFTLEVBQUUsTUFBa0I7SUFDL0QsTUFBTSxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQy9DLE1BQU0sT0FBTyxHQUFpQixNQUFNLENBQUMsYUFBYyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQWdCLENBQUM7SUFDNUYsSUFBSSxhQUFvQixDQUFDO0lBR3pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDWixPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBZ0IsRUFBRSxFQUFFO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFBQyxDQUFDO1lBQ3hDLE1BQU0sZUFBZSxHQUFHLGFBQWEsR0FBRyxVQUFVLEVBQUUsQ0FBQztZQUNyRCxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztZQUVqQyxNQUFNLE9BQU8sR0FBRyxTQUFTLEtBQUssR0FBRztnQkFDL0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUM3QixDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsZUFBZSxDQUFDO1lBQzFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBR2pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsZUFBZSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1osQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ1QsQ0FBQyxDQUFBO1FBRUQsTUFBTSxDQUFDO1lBQ0wsTUFBTTtnQkFDRSxPQUFPLENBQUMsT0FBUSxHQUFHLElBQUksQ0FBQztZQUNoQyxDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFHRCxNQUFNLENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDMUIsQ0FBQztBQUVELDJCQUE0QixHQUFTO0lBQ25DLE1BQU0sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztJQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUM7SUFBQyxDQUFDO0lBRXpCLEdBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzlCLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFckQsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ2YsZ0JBQWlCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUMzQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEUsQ0FBQztBQUNILENBQUMifQ==