<template>
  <div class="vue_container" :style="{background: 'rgba(69, 232, 179,' + opacity + ')'}">
    vue - slide bar
    <Slide
      direction="x"
      :width="width"
      :height="height"
      :default_value="opacity"
      :background_style="background_style"
      :progress_style="progress_style"
      :oninput="oninput"
      :onchange="onchange"
      :onload="onload"
      :options="slide_options"/>
  </div>
</template>

<script>
import Slide from '../../lib/vue';

export default {
  data: () => ({
    width: '300px',
    height: '50px',
    background_style: {
      background: 'rgba(0, 0, 0, .5)',
    },
    progress_style: {
      background: '-webkit-gradient(linear,left top, right bottom, from(#182e38), to(#64aee9))',
    },
    opacity: 0.7,
    slide_options: {
      prohibit_click: true,
    }
  }),
  methods: {
    oninput (value) {
      this.opacity = value;
    },
    onchange (value) {
      this.opacity = value;
    },
    onload (slide) {
      window.vs = slide;
    }
  },
  components: { Slide },
}
</script>

<style>
  .vue_container {
    position: absolute;
    width: 500px;
    height: 200px;
    top: 200px;
    left: 100px;
    border: 1px dashed #ddd;
    margin-bottom: 20px;
  }
</style>


