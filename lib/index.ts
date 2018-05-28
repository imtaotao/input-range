import { expand_touch, init_default_style } from './operate_dom';
import { warn, is_string, is_empty_obj } from './utils';


interface Options {
  dom: HTMLElement;
  direction: 'x' | 'y';
  pointer_events: boolean;
  touch_area: number;
  click_el_index: number;
}

export interface Parameters {
  el: HTMLElement | 'string';
  direction?: 'X' | 'x' | 'Y', 'y'; 
  pointer_events?: boolean;
  touch_area?: number;
  click_el_index?: number;
  point_touch_area?: {
    x: number;
    y: number;
  }
}

export interface SlideTypes {

}

export class Slide {
  public onchange: (value:number, el:HTMLElement) => void;
  public oninput: (value:number, el:HTMLElement) => void;
  private opts: Options;

  public constructor (opts:Parameters) {
    if (!opts.el) {
      warn('El must a HTMLElement or query string');
    }
    if (is_string(opts.el)) {
      (<HTMLElement | null>opts.el) = document.querySelector((<string>opts.el));
      !opts.el && warn(`Can't get HTMLElement from ${opts.el}`);
    }
  
    this.onchange = () => {};
    this.oninput = () => {};
    this.opts = {
      dom: (<HTMLElement>opts.el),
      direction: opts.direction 
        ? (<'x' | 'y'>opts.direction.toLocaleLowerCase())
        : 'x',
      pointer_events: opts.pointer_events || false,
      touch_area: opts.touch_area || 100,
      click_el_index: opts.click_el_index || 0,
    }
  
    if (!is_empty_obj(opts.point_touch_area)) {
      this.expand_touch((<HTMLElement>opts.el), opts.point_touch_area);
    }
  
    this.init_default_style();
  }

  private expand_touch (el:HTMLElement, point_touch_area:Parameters['point_touch_area']) : void { 
    expand_touch(this, el, point_touch_area);
  }

  private init_default_style () : void { init_default_style(this) }
}

export function createSlide (opts:Parameters) : Slide {
  return new Slide(opts);
}
