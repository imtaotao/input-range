import { Slide } from './index';
export declare type DeEvent = TouchEvent | MouseEvent;
export interface ClickInstance {
    remove(): void;
}
export declare function init(ctx: Slide): void;
export declare function mousedown(e: DeEvent): void;
export declare function mousemove(e: DeEvent): void;
export declare function mouseup_touchend_hook(ctx: Slide, e: DeEvent): void;
export declare function dispatch(ctx: Slide, event_type: string, precent: number): void;
export declare function set_click_position(ctx: Slide, parent: HTMLElement): ClickInstance;
