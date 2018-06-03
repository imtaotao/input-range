import './index.css';
import { Slide, createSlide, Parameters } from '../../lib';

document.addEventListener('DOMContentLoaded', () => {
  const slide = createSlide({
    el: '#native .dots',
  });

  slide.init();
  slide.onchange = (value, bar, ctx) => console.log(value);
  (window as any).s = slide;
})
