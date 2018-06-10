import { Slide } from './index';
import { bind, random_num, is_undef } from './utils';
import {
  get_width,
  get_height,
  get_percent,
  get_client_xy,
  alter_slider_bar,
  get_now_percentage,
} from './compute';

export type DeEvent = TouchEvent | MouseEvent;

export interface ClickInstance {
  remove () : void;
}

export function init (ctx:Slide) : void {
  // Avoid "move" and "click" events affecting each other.
  remove_init_event(ctx);

  const { dom, direction, click_el_index, expand_touch_dom } = ctx.opts;
  const parent = <HTMLElement>dom.parentElement;
  const grandpa = <HTMLElement>parent.parentElement;
  const init_event_fn:any = bind(mousedown, ctx);
  const now_percentage = get_now_percentage(ctx, parent);

  const revise_width = get_width(dom) / 2;
  const revise_height = get_height(dom) / 2;

  const total_x = get_width(grandpa);
  const total_y = get_height(grandpa);

  // Compute the remaining distance.
  const last_x = total_x * (1 - now_percentage);
  const last_y = total_y * (1 - now_percentage);

  const click_instance = set_click_position(ctx, parent);
  ctx.value = now_percentage;

  // Mobile and browser add events.
  dom.onmousedown = init_event_fn;
  dom.addEventListener('touchstart', init_event_fn);

  // If there is an extension of the click range.
  if (expand_touch_dom) {
    expand_touch_dom.onmousedown = init_event_fn;
    expand_touch_dom.addEventListener('touchstart', init_event_fn);
  }

  ctx.opts = {
    ...ctx.opts,
    parent,
    total_x,
    total_y,
    revise_height,
    revise_width,
    last_x,
    last_y,
    now_percentage,
    init_event_fn,
    click_instance,
  }
}

export function mousedown (e:DeEvent) : void {
  if (this.opts.prohibit_move) { return; }
  const ctx:Slide = this;
  const { x, y } = get_client_xy(e);
  const { dom, parent, click_instance } = ctx.opts;
  const touchmove:any = bind(mousemove, ctx);

  // Clear click events to avoid interference.
  click_instance.remove();

  ctx.opts.start_xy.x = x - dom.offsetLeft;
  ctx.opts.start_xy.y = y - dom.offsetTop;

  if (e.type !== 'touchstart') {
    document.onmousemove = (<any>bind(mousemove, ctx));
    document.onmouseup = function (e:MouseEvent) {
      !ctx.opts.prohibit_move && dispatch(ctx, 'change', ctx.value);
      (<any>document.onmousemove) = null;
      (<any>document.onmouseup) = null;
      mouseup_touchend_hook(ctx, e);
    }
    return;
  }

  // Mobile
  document.addEventListener('touchmove', touchmove);
  document.addEventListener('touchend', touchend);
  function touchend (e:TouchEvent) {
    !ctx.opts.prohibit_move && dispatch(ctx, 'change', ctx.value);
    document.removeEventListener('touchmove', touchmove);
    document.removeEventListener('touchend', touchend);
    mouseup_touchend_hook(ctx, e);
  }
}


export function mousemove (e:DeEvent) : void {
  if (this.opts.prohibit_move) { return; }
  const ctx:Slide = this;
  const is_phone = e.type === 'touchmove';
  !is_phone && e.preventDefault();

  const {
      total_x,
      total_y,
      revise_height,
      revise_width,
      last_y,
      direction,
  } = ctx.opts;
  const start_xy = ctx.opts.start_xy;
  const { x, y } = get_client_xy(e);

  let left:number = x - start_xy.x;
  let top:number = y - start_xy.y;

  // limit slide
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

export function  mouseup_touchend_hook (ctx:Slide, e:DeEvent) {
  const { total_x, total_y, parent } = ctx.opts;
  const now_percentage = get_now_percentage(ctx, <HTMLElement>parent);
  const time = e.type === 'touchend' ? 15 : 0;

  ctx.opts.last_x = total_x * (1 - now_percentage);
  ctx.opts.last_y = total_y * (1 - now_percentage);

  // Add a click event after "touchend" event ends
  setTimeout(() => {
    set_click_position(ctx, <HTMLElement>parent);
  }, time);
}

export function dispatch (ctx:Slide, event_type:string, precent:number, is_animate?:boolean) : void {
  const parent:any = ctx.opts.parent;
  
  if (is_animate) {
    parent.style.transition = 'all 0.2s ease';
    setTimeout(() => parent.style.transition = '', 205);
  }

  // alter slide bar position.
  alter_slider_bar(ctx, precent);
  ctx.value = precent;

  type DefinitEvent = Event & { value?: number; };
  const event:DefinitEvent = new Event(event_type);

  // response event.
  event.value = precent;
  parent.dispatchEvent(event);
  ctx['on' + event_type](precent, parent, ctx);
}

export function set_click_position (ctx:Slide, parent:HTMLElement) : ClickInstance {
  const { direction, click_el_index } = ctx.opts;
  const sibling = (<HTMLElement>parent.parentElement).children[click_el_index] as HTMLElement;
  let random_number:number;

  // If HTMLElement exists, continue, Click event need forever add.
  if (sibling) {
    sibling.onclick = (event:MouseEvent) => {
      if (ctx.opts.prohibit_click) { return; }
      const self_random_num = random_number = random_num();
      const { layerX, layerY } = event;

      const precent = direction === 'x'
        ? layerX / get_width(sibling)
        : 1 - layerY / get_height(sibling);

      dispatch(ctx, 'change', precent, true);

      // reset slide state.
      setTimeout(() => {
        if (self_random_num !== random_number) { return; }
        init(ctx);
      }, 200)
    }

    return {
      remove () {
        (<any>sibling.onclick) = null;
      }
    };
  }

  // Return by default.
  return { remove () {} };
}

function remove_init_event (ctx:Slide) : void {
  const { dom, init_event_fn, expand_touch_dom} = ctx.opts;
  if (!init_event_fn) { return; }

  (<any>dom).onmousedown = null;
  dom.removeEventListener('touchstart', init_event_fn);

  if (expand_touch_dom) {
    (<any>expand_touch_dom).onmousedown = null;
    expand_touch_dom.removeEventListener('touchstart', init_event_fn);
  }
}