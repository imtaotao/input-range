<template>
  <div :class="'container-' + direction" :style="{width, height}">
    <span :class="'background_and_bar_' + direction"></span>
    <span :class="'background_and_bar_' + direction">
      <i>
      </i>
    </span>
  </div>
</template>

<script>
  import { createSlide } from '../index';

  export default {
    props: {
      direction: {
        type: String,
        default: 'x',
      },
      width: {
        type: String,
        required: true,
      },
      height: {
        type: String,
        required: true,
      },
      Zindex: {
        type: Number,
        required: true,
      },
      default_value: {
        type: Number,
        default: 0,
      },
      background_style: {
        type: Object,
        default: {},
      },
      progress_style: {
        type: Object,
        default: {},
      },
      dot_style: {
        type: Object,
        default: {},
      },
      options: {
        type: Object,
        default: {},
      },
      onload: Function,
      onerror: Function,
      oninput: Function,
      onchange: Function,
    },
    data: () => {},
    methods () {

    },
    create () {

    }
  }
</script>

<style lang="scss" scoped>
  .container_x {
    position: relative;
    z-index: 99;
    top: 100px;
    left: 100px;
  }
  .container_y {
    position: relative;
    z-index: 99;
    position: relative;
    left: 100px;
  }
  .background_and_bar_x {
    position: absolute;
    top: 0;
    left: 0;
    height: 8px;
    border-radius: 10px;
  }
  .background_and_bar_y {
    position: absolute;
    width: 8px;
    border-radius: 10px;
  }
</style>


