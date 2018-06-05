import React, { Component } from 'react';
import { createSlide } from '../index';

export interface SlideProps {
  direction?: 'x' | 'y',
  width: string;
  height: string;
  Zindex?: number;
  background_style?: Object;
  progress_style?: Object;
  dots_style?: Object;
  onerror?: Function;
  onload?: Function;
  oninput?: Function;
  onchange?: Function;
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
    } = (this as any).props;

    if (!this.Dot) {
      onload(false);
      return;
    }

    const slide = createSlide({
      point: this.Dot,
      direction: 'y',
      prohibit_click: false,
      expand_touch_area: {
        width: 40,
        height: 40,
      },
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
        dots_style = {},
        direction = 'x',
        Zindex = 99,
    } = (this as any).props;

    return (
      <div id="native" style={container_style((this as any).props, Zindex)}>
        <span style={background_style(background_style, direction)}></span>
        <span style={progress_style(background_style, direction)}>
          <i
            style={dots_style(dots_style, direction)}
            ref={(ref) => { ref && (this.Dot = ref)}}>
          </i>
        </span>
      </div>
    )
  }
}

function container_style ({width, height}, Zindex) : Object {
  return {
    position: 'relative',
    Zindex,
    width,
    height,
  }
}

function background_style (style, direction) : Object {
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

function progress_style (style, direction) : Object {
  const init_progress_style = direction === 'x'
    ? {
      width: '50%',
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

function dots_style (style, direction) : Object {
  const init_dots_style = direction === 'x'
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
    ...init_dots_style,
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