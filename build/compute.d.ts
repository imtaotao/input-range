import { Slide } from './index';
export declare function get_now_percentage(ctx: Slide, parent: HTMLElement): number;
export declare function get_width(dom: HTMLElement): number;
export declare function get_height(dom: HTMLElement): number;
export declare function get_client_xy(e: TouchEvent | MouseEvent): {
    x: number;
    y: number;
};
export declare function get_percent(ctx: Slide, left: number, top: number): any;
export declare function alter_slider_bar(ctx: Slide, precent: number): void;
