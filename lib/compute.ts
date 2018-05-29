import { Slide } from './index';
import { ClickInstance } from './operate_dom';

export function mousedown (e:Event) : void {

}

export function get_now_percentage (context:Slide, parent:HTMLElement) : number {
  return 0;
}

export function get_width (dom:HTMLElement) : number {
  return parseInt((<any>getComputedStyle(dom)).width);
}

export function get_height (dom:HTMLElement) : number {
  return parseInt((<any>getComputedStyle(dom)).height);
}

export function set_click_position (context:Slide, parent:HTMLElement) : ClickInstance {
  return { remove () {} };
}