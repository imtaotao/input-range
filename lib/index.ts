import { warn, StackDetail } from './debug';
import { expand_touch, init_default_style } from './expand';

import {
  init,
  dispatch,
  ClickInstance,
} from './event';

import {
  bind,
  is_undef,
  is_number,
  is_boolen,
  is_string,
  is_empty_obj,
} from './utils';

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
  start_xy: {
    x: number;
    y: number;
  }
}

export interface Options extends DynamicAttr {
  dom: HTMLElement;
  limit_area: number;
  direction: 'x' | 'y';
  prohibit_click: boolean;
  prohibit_move: boolean;
  pointer_events: boolean;
  click_el_index: number;
}

export interface Parameters {
  point: string | Element;
  direction?: 'X' | 'x' | 'Y'| 'y';
  limit_area?: number;
  pointer_events?: boolean;
  prohibit_click?: boolean;
  prohibit_move?: boolean;
  click_el_index?: number;
  expand_touch_area?: {
    width: number | string;
    height: number | string;
  }
}

export interface SlideTypes {
  init () : Slide;
  dispatch (event_type:'input' | 'change', value:number, is_animate?:boolean) : Slide;
  prohibit_click (prohibit) : Slide;
}

export class Slide implements SlideTypes {
  public version = 'v1.2.6';
  public value:number;
  public onchange: (value:number, el:HTMLElement, ctx:Slide) => void;
  public oninput: (value:number, el:HTMLElement, ctx:Slide) => void;
  public onerror: (msg:string, stack:StackDetail, error_str:string) => void;
  public opts: Options;

  public constructor (options:Parameters) {
    if (!options || typeof options !== 'object') {
      warn(null, '【options】 must a object, detailed usage can be seen here. https://github.com/imtaotao/input-range');
    }
    if (!options.point) {
      warn(null, '【options.point】 must a HTMLElement or query string');
    }
    if (is_string(options.point)) {
      (<Element | null>options.point) = document.querySelector((<string>options.point));
      !options.point && warn(null, `Can't get HTMLElement from【${options.point}】`);
    }

    // hook functions
    this.onchange = () => {};
    this.oninput = () => {};
    this.onerror = () => false;

    // set default value
    (<any>this.opts) = {
      dom: (<HTMLElement>options.point),
      limit_area: options.limit_area || 100,
      click_el_index: options.click_el_index || 0,
      expand_touch_dom: 0,
      prohibit_click: !!options.prohibit_click,
      prohibit_move: !!options.prohibit_move,
      start_xy: { /* set default value */
        x: 0,
        y: 0,
      }
    }

    this.opts.direction = options.direction
      ? (<'x' | 'y'>options.direction.toLocaleLowerCase())
      : 'x';

    this.opts.pointer_events = !is_undef(options.pointer_events)
      ? <boolean>options.pointer_events
      : true;

    if (this.opts.direction !== 'x' && this.opts.direction !== 'y') {
      warn(this, '【options direction】 must be x or y')
    }

    if (options.expand_touch_area && !is_empty_obj(options.expand_touch_area)) {
      expand_touch(this, (<HTMLElement>options.point), options.expand_touch_area);
    }

    init_default_style(this);
  }

  public init () : Slide {
    init(this);

    return this;
  }

  public dispatch (event_type:'input' | 'change', value:number, is_animate?:boolean) : Slide {
    if (event_type !== 'input' && event_type !== 'change') {
      warn(this, '【dispatch event type】must be "input" or "change"');
    }
    if (!is_number(value) || value < 0 || value > 1) {
      warn(this, '【dispatch value】 is not between 0 and 1');
    }

    dispatch(this, event_type, value, is_animate);

    return this;
  }

  public prohibit_click (prohibit:boolean) : Slide {
    !is_boolen(prohibit) && warn(this, '【prohibit】 must be true or false');
    this.opts.prohibit_click = prohibit;

    return this;
  }

  public prohibit_move (prohibit:boolean) : Slide {
    !is_boolen(prohibit) && warn(this, '【prohibit】 must be true or false');
    this.opts.prohibit_move = prohibit;

    return this;
  }
}

export function createSlide (opts:Parameters) : Slide {
  return new Slide(opts);
}
