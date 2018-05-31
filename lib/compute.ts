import { Slide } from './index';
import { ClickInstance } from './event';

export function get_now_percentage (context:Slide, parent:HTMLElement) : number {
  return 0;
}

export function get_width (dom:HTMLElement) : number {
  return parseInt((<any>getComputedStyle(dom)).width);
}

export function get_height (dom:HTMLElement) : number {
  return parseInt((<any>getComputedStyle(dom)).height);
}

export function get_client_xy (e:TouchEvent | MouseEvent) {
  const type = e.type.includes('touch');
  const x = type
    ? (<TouchEvent>e).changedTouches[0].clientX
    : (<MouseEvent>e).clientX;

  const y = type
    ? (<TouchEvent>e).changedTouches[0].clientY
    : (<MouseEvent>e).clientY;

  return { x, y };
}

export function get_percent (ctx:Slide, left:number, top:number) : any /* Actually return number */ {
  const {
      total_x,
      total_y,
      revise_height,
      revise_width,
      direction,
      last_y,
      touch_area
  } = ctx.opts;
  const is_normal_val = (val:number) => val > -touch_area && val < touch_area;

  if (direction === 'x' && is_normal_val(top)) {
    const nowVal = left + revise_width;
    return nowVal / total_x;
  }

  if (direction === 'y' && is_normal_val(left)) {
    const normal_y  = total_y - last_y - revise_height / 2;
    return (normal_y - top) / total_y;
  }
}