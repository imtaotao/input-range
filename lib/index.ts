import {
  init,
  expand_touch,
  init_default_style,
  ClickInstance,
} from './operate_dom';
import { warn, is_string, is_empty_obj } from './utils';

export interface DynamicAttr {
  expand_touch_dom: HTMLElement | 0;
  parent: HTMLElement | 0;
  total_x: number;
  total_y: number; 
  revise_height: number,
  revise_width: number, 
  last_x: number;
  last_y: number;
  now_percentage:number;
  init_event_fn() : void;
  click_instance:ClickInstance;
}

export interface Options extends DynamicAttr {
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
  init () : void;
}

export class Slide {
  public onchange: (value:number, el:HTMLElement) => void;
  public oninput: (value:number, el:HTMLElement) => void;
  public opts: Options;

  public constructor (opts:Parameters) {
    if (!opts.el) {
      warn(`【${opts.el}】 must a HTMLElement or query string`);
    }
    if (is_string(opts.el)) {
      (<HTMLElement | null>opts.el) = document.querySelector((<string>opts.el));
      !opts.el && warn(`Can't get HTMLElement from ${opts.el}`);
    }
  
    this.onchange = () => {};
    this.oninput = () => {};
    (<any>this.opts) = {
      dom: (<HTMLElement>opts.el),
      direction: opts.direction 
        ? (<'x' | 'y'>opts.direction.toLocaleLowerCase())
        : 'x',
      pointer_events: opts.pointer_events || false,
      touch_area: opts.touch_area || 100,
      click_el_index: opts.click_el_index || 0,
      expand_touch_dom: 0,
    }
  
    if (opts.point_touch_area && !is_empty_obj(opts.point_touch_area)) {
      this.expand_touch((<HTMLElement>opts.el), opts.point_touch_area);
    }
  
    this.init_default_style();
  }
  
  public init () : void {
    init(this);
  }

  private expand_touch (el:HTMLElement, point_touch_area:Parameters['point_touch_area']) : void { 
    expand_touch(this, el, point_touch_area);
  }

  private init_default_style () : void {
    init_default_style(this);
  }
}

export function createSlide (opts:Parameters) : Slide {
  return new Slide(opts);
}
