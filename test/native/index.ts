import './index.css';
import { Slide, createSlide, Parameters } from '../../lib';

document.addEventListener('DOMContentLoaded', () => {
  const slide = createSlide({
    el: '#native .dots',
  });

  slide.init();
  slide.oninput = (...args) => console.log(args);
})
