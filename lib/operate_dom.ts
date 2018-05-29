import { Slide, Parameters } from './index';
import { bind } from './utils';
import {
  mousedown,
  get_now_percentage,
  get_width,
  get_height,
  set_click_position,
} from './compute';

export interface ClickInstance {
  remove () : void;
}

export function init (ctx:Slide) : void {
    const { dom, direction, touch_area, click_el_index, expand_touch_dom } = ctx.opts;
    const parent = <HTMLElement>dom.parentElement;
    const grandpa = <HTMLElement>parent.parentElement;
    const init_event_fn:any = bind(mousedown, ctx);
    const now_percentage = get_now_percentage(ctx, parent);

    const revise_width = get_width(dom) / 2;
    const revise_height = get_height(dom) / 2;
    
    const total_x = get_width(grandpa);
    const total_y = get_height(grandpa);

    // 剩下的的长度
    const last_x = total_x * (1 - now_percentage);
    const last_y = total_y * (1 - now_percentage);

    const click_instance = set_click_position(ctx, parent);
    (<any>parent).value = now_percentage;
    
    // 移动端与浏览器端添加事件
    dom.onmousedown = init_event_fn;
    dom.addEventListener('touchstart', init_event_fn);

    // 如果有点击范围的扩展
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

export function init_default_style (ctx:Slide) : void {
  
}

export type pointTouchArea = Parameters['point_touch_area']
export function expand_touch (ctx:Slide, el:HTMLElement, point_touch_area:pointTouchArea) : void {

}