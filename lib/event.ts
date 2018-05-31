import { Slide, Parameters } from './index';
import { alter_slider_bar } from './operate_dom';
import { bind } from './utils';
import { 
  get_client_xy,
  get_now_percentage,
  get_percent,
} from './compute';

export type DeEvent = TouchEvent | MouseEvent;

export interface ClickInstance {
  remove () : void;
}

export function mousedown (e:DeEvent) : void {
  const ctx:Slide = this;
  const { x, y } = get_client_xy(e);
  const { dom, parent, click_instance } = ctx.opts;
  const touchmove:any = bind(mousemove, ctx);

  // 清除点击事件，避免干扰
  click_instance.remove();

  ctx.start_xy.x = x - dom.offsetLeft;
  ctx.start_xy.y = y - dom.offsetTop;

  if (e.type !== 'touchstart') {
    document.onmousemove = (<any>bind(mousemove, ctx));
    document.onmouseup = function (e:MouseEvent) {
      dispatch(ctx, <HTMLElement>parent, 'change');
      document.onmousemove = null;
      document.onmouseup = null;
      mouseup_touchend_hook(ctx, e);
    }
    return;
  }

  // 移动端
  document.addEventListener('touchmove', touchmove);
  document.addEventListener('touchend', touchend);
  function touchend (e:TouchEvent) {
    dispatch(ctx, <HTMLElement>parent, 'change');
    document.removeEventListener('touchmove', touchmove);
    document.removeEventListener('touchend', touchend);
    mouseup_touchend_hook(ctx, e);
  }
}


export function mousemove (e:DeEvent) : void {
  const ctx:Slide = this;
  const is_phone = e.type === 'touchmove';
  !is_phone && e.preventDefault();

  const { 
      dom,
      parent,
      total_x,
      total_y,
      revise_height,
      revise_width,
      last_y,
      direction,
  } = ctx.opts;
  const { start_xy } = ctx;
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
  // Assign value to dom's "value" property.
  alter_slider_bar(dom, <HTMLElement>parent, direction, precent);
  dispatch(ctx, dom, 'input')
}

export function  mouseup_touchend_hook (ctx:Slide, e:DeEvent) {
  const { total_x, total_y, parent } = ctx.opts;
  const now_percentage = get_now_percentage(ctx, <HTMLElement>parent);
  const time = e.type === 'touchend' ? 15 : 0;

  ctx.opts.last_x = total_x * (1 - now_percentage);
  ctx.opts.last_y = total_y * (1 - now_percentage);

  // 在touchend事件结束后重新加上点击事件
  setTimeout(() => {
    set_click_position(ctx, <HTMLElement>parent);
  }, time);
}

export function set_click_position (context:Slide, parent:HTMLElement) : ClickInstance {
  return { remove () {} };
}

export function dispatch (ctx:Slide, el:HTMLElement, event_type:string) : void {
  type DefinitEvent = Event & { value?: number; } ;
  const event:DefinitEvent = new Event(event_type);

  event.value = (<any>el).value;
  el.dispatchEvent(event);
  ctx['on' + event_type]((<any>el).value, el);
}