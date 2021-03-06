import { Slide } from './index';

export function get_now_percentage (ctx:Slide, parent:HTMLElement) : number {
  const direction = ctx.opts.direction;
  const grandfather = parent.parentElement as HTMLElement;

  return direction === 'x'
    ? get_width(parent) / get_width(grandfather)
    : get_height(parent) / get_height(grandfather);
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
      limit_area,
  } = ctx.opts;
  const is_normal_val = (val:number) => val > -limit_area && val < limit_area;

  if (direction === 'x' && is_normal_val(top)) {
    const nowVal = left + revise_width;
    return nowVal / total_x;
  }

  if (direction === 'y' && is_normal_val(left)) {
    const normal_y  = total_y - last_y - revise_height / 2;
    return (normal_y - top) / total_y;
  }
}

export function alter_slider_bar (ctx:Slide, precent:number) : void {
  const { parent, direction } = ctx.opts;

  const attr = direction === 'x' ? 'width' : 'height';
  (<HTMLElement>parent).style[attr] = precent * 100 + '%';
}