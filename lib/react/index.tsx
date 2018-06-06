import React, { Component } from 'react';
import { createSlide, Slide } from '../index';
import { StackDetail } from '../debug';

export interface SlideProps {
  direction?: 'x' | 'y',
  width: string;
  height: string;
  Zindex?: number;
  default_value?: string;
  background_style?: Object;
  progress_style?: Object;
  dot_style?: Object;
  onload?: (slide:Slide) => void;
  onerror?: (msg:string, stack:StackDetail, error_str:string) => void;
  oninput?: (value:number, el:HTMLElement, slide:Slide) => void;
  onchange?: (value:number, el:HTMLElement, slide:Slide) => void;
  options?: {
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
}

export default class SlideComponent extends Component<SlideProps, {}> {
  private Dot:HTMLElement;
  public constructor (props:SlideProps) {
    super(props);
  }

  public componentDidMount() {
    const {
      onload,
      onerror,
      oninput,
      onchange,
      direction = 'x',
      options = {},
    } = (this as any).props;

    if (!this.Dot && onload) {
      onload(false);
      return;
    }

    const slide = createSlide({
      point: this.Dot,
      direction,
      ...options,
    })

    onerror && (slide.onerror = onerror);
    oninput && (slide.oninput = oninput);
    onchange && (slide.onchange = onchange);

    slide.init();
    onload && onload(slide);
  }

  public render () {
    const {
        background_style = {},
        progress_style = {},
        dot_style = {},
        default_value = 0,
        direction = 'x',
        Zindex = 99,
    } = (this as any).props;

    return (
      <div style={get_container_style((this as any).props, Zindex)}>
        <span style={get_background_style(background_style, direction)}></span>
        <span style={get_progress_style(progress_style, direction, Number(default_value))}>
          <i
            style={get_dot_style(dot_style, direction)}
            ref={(ref) => { ref && (this.Dot = ref)}}>
          </i>
        </span>
      </div>
    )
  }
}

function get_container_style ({width, height}:any, Zindex:number) : Object {
  return {
    position: 'relative',
    Zindex,
    width,
    height,
  }
}

function get_background_style (style:any, direction: 'x' | 'y') : Object {
  const init_background_style = direction === 'x'
    ? {width: '100%'}
    : {height: '100%'};

  return {
    ...default_span_style(direction),
    ...init_background_style,
    background: '#366d68',
    ...style,
  }
}

function get_progress_style (style:any, direction: 'x' | 'y', default_value:number) : Object {
  default_value = Math.max(Math.min(default_value, 1), 0);

  const init_progress_style = direction === 'x'
    ? {
      width: `${default_value * 100}%`,
      paddingLeft: '7px',
    }
    : {
      height: 0,
      bottom: 0,
    };

  return {
    ...default_span_style(direction),
    ...init_progress_style,
    background: '-webkit-gradient(linear,left top, right bottom, from(#a1f1a3), to(#3974d5))',
    ...style,
  }
}

function get_dot_style (style:any, direction: 'x' | 'y') : Object {
  const init_dot_style = direction === 'x'
    ? {
      marginTop: '-3px',
      right: 0,
      width: '8px',
      height: '14px',
    }
    : {
      marginLeft: '-3px',
      marginTop: '-5px',
      top: 0,
      width: '14px',
      height: '8px',
    }

  return {
    display: 'inline-block',
    background: '#fff',
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2)',
    borderRadius: '100px',
    ...init_dot_style,
    ...style,
  }
}

function default_span_style (direction: 'x' | 'y') : Object {
  const init_style = {
    position: 'absolute',
    borderRadius: '10px',
  }

  return direction === 'x'
    ? {
      ...init_style,
      top: 0,
      left: 0,
      height: '8px',
    }
    : {
      ...init_style,
      width: '8px',
    }
}