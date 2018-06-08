import './native';
import { v_init } from './vue_test';
import { r_init } from './react_test';

document.addEventListener('DOMContentLoaded', () => {
  r_init();
  v_init();
})