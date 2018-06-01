import { Slide, Parameters } from './index';
import { bind } from './utils';

export function init_default_style (ctx:Slide) : void {
  const { dom, pointer_events, click_el_index} = ctx.opts;
  const parent = dom.parentElement as HTMLElement;
  const is_range_err = click_el_index < 0 || click_el_index > (<any>parent.parentElement).childElementCount - 1;

  if (pointer_events) {
    dom.style.pointerEvents = 'auto';
    parent.style.pointerEvents = 'none';
  }

  if (is_range_err) {
    throw new RangeError('【click_el_index】 is not in the correct range.');
  }

  const position = getComputedStyle(parent).position;
  if (position === 'static') {
    dom.style.position = 'relative'
    return;
  }
  dom.style.position = 'absolute';
}

export type pointTouchArea = Parameters['point_touch_area']
export function expand_touch (ctx:Slide, el:HTMLElement, point_touch_area:pointTouchArea) : void {

}