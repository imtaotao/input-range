import {
  expand_touch,
  init_default_style,
} from './expand';
import {
  get_now_percentage,
  get_width,
  get_height,
} from './compute';
import {
  ClickInstance,
  mousedown,
  set_click_position,
  dispatch,
} from './event';
import {
  warn,
  bind,
  is_undef,
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
}

export interface Options extends DynamicAttr {
  dom: HTMLElement;
  direction: 'x' | 'y';
  pointer_events: boolean;
  touch_area: number;
  click_el_index: number;
}

export interface Parameters {
  el: string | Element;
  direction?: 'X' | 'x' | 'Y'| 'y';
  pointer_events?: boolean;
  touch_area?: number;
  click_el_index?: number;
  point_touch_area?: {
    x?: number;
    y?: number;
  }
}

export interface SlideTypes {
  init () : void;
  dispatch (event_type:'input' | 'change', value:number) : void;
}

export class Slide implements SlideTypes {
  public value:number;
  public onchange: (value:number, el:HTMLElement, ctx:Slide) => void;
  public oninput: (value:number, el:HTMLElement, ctx:Slide) => void;
  public opts: Options;
  public start_xy: {
    x: number;
    y: number;
  };

  public constructor (options:Parameters) {
    if (!options.el) {
      warn(`【${options.el}】 must a HTMLElement or query string`);
    }
    if (is_string(options.el)) {
      (<Element | null>options.el) = document.querySelector((<string>options.el));
      !options.el && warn(`Can't get HTMLElement from【${options.el}】`);
    }

    this.onchange = () => {};
    this.oninput = () => {};
    this.start_xy = { /* set default value */
      x: 0,
      y: 0,
    };

    // set default value
    (<any>this.opts) = {
      dom: (<HTMLElement>options.el),
      direction: options.direction
        ? (<'x' | 'y'>options.direction.toLocaleLowerCase())
        : 'x',
      pointer_events: !is_undef(options.pointer_events)
        ? options.pointer_events
        : true,
      touch_area: options.touch_area || 100,
      click_el_index: options.click_el_index || 0,
      expand_touch_dom: 0,
    }
    
    if (this.opts.direction !== 'x' && this.opts.direction !== 'y') {
      warn('【options direction】 must be x or y')
    }

    if (options.point_touch_area && !is_empty_obj(options.point_touch_area)) {
      expand_touch(this, (<HTMLElement>options.el), options.point_touch_area);
    }

    init_default_style(this);
  }

  public init () : void {
    init(this);
  }

  public dispatch (event_type:'input' | 'change', value:number) : void {
    if (value < 0 || value > 1) {
      warn(`【${value}】 is not between 0 and 1`);
    }

    dispatch(this, event_type, value);
  }
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
  ctx.value = now_percentage;

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

export function createSlide (opts:Parameters) : Slide {
  return new Slide(opts);
}
