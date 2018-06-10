import { warn } from './debug';
import { Slide, Parameters } from './index';
import {
  is_undef,
  is_number,
} from './utils';
import { get_width, get_height } from './compute';

export function init_default_style (ctx:Slide) : void {
  const { dom, pointer_events, click_el_index} = ctx.opts;
  const parent = dom.parentElement as HTMLElement;
  const is_range_err = click_el_index < 0 ||
                       click_el_index > (<any>parent.parentElement).childElementCount - 1;

  if (is_range_err) {
    warn(ctx, '【click_el_index】 is not in the correct range');
  }

  if (pointer_events) {
    dom.style.pointerEvents = 'auto';
    parent.style.pointerEvents = 'none';
  }

  const position = getComputedStyle(parent).position;
  if (position === 'static') {
    dom.style.position = 'relative';
    return;
  }
  dom.style.position = 'absolute';
}

export type Area = {
  width: number | string,
  height: number | string,
}
export function expand_touch (ctx:Slide, el:HTMLElement, area:Area) : void {
  const { dom, parent, css_text, expand_div } =  check_and_respose(ctx, area);
  let first = true;

  watch_dom_display(dom, ({ old_display }) => {
    old_display = (/^display:([^;]+)/.exec(old_display) || [])[1];

    if (old_display) {
      expand_div.style.display = old_display.trim() === 'none' && !first
        ? 'block'
        : 'none';

      first = false;
    }
  });

  expand_div.style.cssText = css_text
  dom.style.zIndex = '999';
  parent.appendChild(expand_div);
  ctx.opts.expand_touch_dom = expand_div;
}

type ResponseDom = {
  dom:HTMLElement;
  parent:HTMLElement;
  css_text: string;
  expand_div:HTMLElement;
}
function check_and_respose (ctx:Slide, { width, height }) : ResponseDom {
  is_undef(width) && warn(ctx, 'Missing attribute【width】in expand_touch_area');
  is_undef(height) && warn(ctx, 'Missing attribute【height】in expand_touch_area');
  is_number(width) && (width += 'px');
  is_number(height) && (height += 'px');

  const { dom, direction } = ctx.opts;
  const point_width_half = get_width(dom) / 2;

  const css_text =
    `width:${width}; height:${height};` +
    'position:absolute;' +
    'pointer-events:auto;' +
    'z-index:998;' +
    (direction === 'x'
      ? `top:calc(50% - ${height} / 2); right:calc(-${width} / 2 + ${point_width_half}px);`
      : `top:calc(-${height} / 2); left:calc(50% - ${width} / 2);`);

  return {
    dom,
    css_text,
    parent: dom.parentElement as HTMLElement,
    expand_div: document.createElement('div'),
  }
}

function watch_dom_display (dom:HTMLElement, callback:Function) : void {
  const observer = createMutationObserver((mutations) => {
    callback(mutations[0]);
  });

  observer.observe(dom, { attributes: true, attributeOldValue:true });
}

const createMutationObserver = (() => {
  const M =
    (<any>window).MutationObserver ||
    (<any>window).WebKitMutationObserver ||
    (<any>window).MozMutationObserver;

  return (...args) : MutationObserver  => new M(...args);
})();