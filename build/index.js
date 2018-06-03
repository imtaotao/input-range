import { warn } from './debug';
import { expand_touch, init_default_style } from './expand';
import { init, dispatch, } from './event';
import { is_undef, is_boolen, is_string, is_empty_obj, } from './utils';
export class Slide {
    constructor(options) {
        if (!options.point) {
            warn(`【${options.point}】 must a HTMLElement or query string`);
        }
        if (is_string(options.point)) {
            options.point = document.querySelector(options.point);
            !options.point && warn(`Can't get HTMLElement from【${options.point}】`);
        }
        this.onchange = () => { };
        this.oninput = () => { };
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
            warn('【options direction】 must be x or y');
        }
        if (options.expand_touch_area && !is_empty_obj(options.expand_touch_area)) {
            expand_touch(this, options.point, options.expand_touch_area);
        }
        init_default_style(this);
    }
    init() {
        init(this);
        return this;
    }
    dispatch(event_type, value) {
        if (value < 0 || value > 1) {
            warn(`【${value}】 is not between 0 and 1`);
        }
        dispatch(this, event_type, value);
        return this;
    }
    prohibit_click(prohibit) {
        !is_boolen(prohibit) && warn('【prohibit】 must be true or false');
        this.opts.prohibit_click = prohibit;
        return this;
    }
    prohibit_move(prohibit) {
        !is_boolen(prohibit) && warn('【prohibit】 must be true or false');
        this.opts.prohibit_move = prohibit;
        return this;
    }
}
export function createSlide(opts) {
    return new Slide(opts);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMvQixPQUFPLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBUTVELE9BQU8sRUFDTCxJQUFJLEVBQ0osUUFBUSxHQUlULE1BQU0sU0FBUyxDQUFDO0FBRWpCLE9BQU8sRUFFTCxRQUFRLEVBQ1IsU0FBUyxFQUNULFNBQVMsRUFDVCxZQUFZLEdBQ2IsTUFBTSxTQUFTLENBQUM7QUFrRGpCLE1BQU07SUFNSixZQUFvQixPQUFrQjtRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLHNDQUFzQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxDQUFDLEtBQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFVLE9BQU8sQ0FBQyxLQUFNLENBQUMsQ0FBQztZQUNsRixDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLDhCQUE4QixPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUN6RSxDQUFDO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFHbEIsSUFBSSxDQUFDLElBQUssR0FBRztZQUNqQixHQUFHLEVBQWdCLE9BQU8sQ0FBQyxLQUFNO1lBQ2pDLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVSxJQUFJLEdBQUc7WUFDckMsY0FBYyxF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