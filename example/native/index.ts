import './index.css';
import { Slide, createSlide, Parameters } from '../../lib';

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('#native .dots') as HTMLElement;
  const slide = createSlide({
    point: el,
    direction: 'x',
    prohibit_click: false,
    expand_touch_area: {
      width: 40,
      height: 40,
    },
  });

  slide.init();
  type DefinitEvent = Event & { value: number };
  (<any>el.parentElement).oninput = (e:DefinitEvent) => {
    document.body.style.opacity = e.value + 0.1 + '';
  };
  (<any>el.parentElement).onchange = (e:DefinitEvent) => {
    document.body.style.opacity = e.value + 0.1 + '';
  };

  (window as any).ns = slide;

  slide.onerror = (msg, stack, str) => {
    console.log(msg);
    console.log(stack);
    console.error(str);
  }
})
