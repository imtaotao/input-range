import { StackDetail } from './debug';
import { ClickInstance } from './event';
export interface DynamicAttr {
    expand_touch_dom: HTMLElement | 0;
    parent: HTMLElement | 0;
    total_x: number;
    total_y: number;
    revise_height: number;
    revise_width: number;
    last_x: number;
    last_y: number;
    now_percentage: number;
    init_event_fn(): void;
    click_instance: ClickInstance;
    start_xy: {
        x: number;
        y: number;
    };
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
    direction?: 'X' | 'x' | 'Y' | 'y';
    limit_area?: number;
    pointer_events?: boolean;
    prohibit_click?: boolean;
    prohibit_move?: boolean;
    click_el_index?: number;
    expand_touch_area?: {
        width: number | string;
        height: number | string;
    };
}
export interface SlideTypes {
    init(): Slide;
    dispatch(event_type: 'input' | 'change', value: number, is_animate?: boolean): Slide;
    prohibit_click(prohibit: any): Slide;
}
export declare class Slide implements SlideTypes {
    version: string;
    value: number;
    onchange: (value: number, el: HTMLElement, ctx: Slide) => void;
    oninput: (value: number, el: HTMLElement, ctx: Slide) => void;
    onerror: (msg: string, stack: StackDetail, error_str: string) => void;
    opts: Options;
    constructor(options: Parameters);
    init(): Slide;
    dispatch(event_type: 'input' | 'change', value: number, is_animate?: boolean): Slide;
    prohibit_click(prohibit: boolean): Slide;
    prohibit_move(prohibit: boolean): Slide;
}
export declare function createSlide(opts: Parameters): Slide;
