import './index.css';
import { Slide, createSlide, Parameters } from '../../lib';

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('#native .dots') as HTMLElement;
  const slide = createSlide({
    point: el,
    direction: 'y',
    prohibit_click: false,
    expand_touch_area: {
      width: 40,
      height: 40,
    },
  });

  slide.init();
  type DefinitEvent = Event & { value?: number };
  (<any>el.parentElement).oninput = (e:DefinitEvent) => console.log(e.value);;
  (window as any).s = slide;
})
