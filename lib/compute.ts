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