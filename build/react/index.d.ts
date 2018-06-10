/// <reference types="react" />
import { Component } from 'react';
import { Slide } from '../index';
import { StackDetail } from '../debug';
export interface SlideProps {
    direction?: 'x' | 'y';
    width: string;
    height: string;
    Zindex?: number;
    default_value?: string;
    background_style?: Object;
    progress_style?: Object;
    dot_style?: Object;
    onload?: (slide: Slide) => void;
    onerror?: (msg: string, stack: StackDetail, error_str: string) => void;
    oninput?: (value: number, el: HTMLElement, slide: Slide) => void;
    onchange?: (value: number, el: HTMLElement, slide: Slide) => void;
    options?: {
        limit_area?: number;
        pointer_events?: boolean;
        prohibit_click?: boolean;
        prohibit_move?: boolean;
        click_el_index?: number;
        expand_touch_area?: {
            width: number | string;
            height: number | string;
        };
    };
}
export default class SlideComponent extends Component<SlideProps, {}> {
    private Dot;
    constructor(props: SlideProps);
    componentDidMount(): void;
    render(): JSX.Element;
}
