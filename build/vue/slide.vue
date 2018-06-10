<template>
  <div class="__container" :style="{width, height, Zindex}">
    <span :class="background_class" :style="background_style"></span>
    <span :class="progress_class" :style="progress_style">
      <i ref="dot" :class="'__default_dot __dot_' + direction" :style="dot_style">
      </i>
    </span>
  </div>
</template>

<script>
import { createSlide } from '../index';

export default {
  name: 'inputRange',
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
      default: 99,
    },
    default_value: {
      type: Number,
      default: 0,
    },
    background_style: {
      type: Object,
      default: () => ({}),
    },
    progress_style: {
      type: Object,
      default: () => ({}),
    },
    dot_style: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    onload: Function,
    onerror: Function,
    oninput: Function,
    onchange: Function,
  },
  computed: {
    background_class () {
      return  `__background_${this.direction} __default_and_bar_${this.direction}`;
    },
    progress_class (){
      return `__progress_${this.direction} __default_and_bar_${this.direction}`;
    },
  },
  mounted () {
    let {
      default_value,
      direction,
      oninput,
      onchange,
      onerror,
      onload,
      options,
    } = this;
    const point = this.$refs.dot;
    
    if (!point && onload) {
      onload(false);
    }
    
    const slide = createSlide(Object.assign({}, {
      point,
      direction,
    }, options));

    slide.init();

    default_value = Math.max(Math.min(this.default_value, 1), 0);
    slide.dispatch('change', default_value);
    
    onerror && (slide.onerror = onerror);
    oninput && (slide.oninput = oninput);
    onchange && (slide.onchange = onchange);

    onload && onload(slide);
  }
}
</script>

<style>
  .__container {
    position: relative;
    z-index: 99;
  }

  .__default_and_bar_x {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    border-radius: 10px;
  }
  .__default_and_bar_y {
    position: absolute;
    width: 8px;
    height: 100%;
    border-radius: 10px;
  }

  .__background_x {
    width: 100%;
    background: #366d68;
  }

  .__background_y {
    height: 100%;
    background: #366d68;
  }
  
  .__progress_x {
    padding-left: 7px;
    background: -webkit-gradient(linear,left top, right bottom, from(#a1f1a3), to(#3974d5));
  }
  .__progress_y {
    height: 0;
    bottom: 0;
    background: -webkit-gradient(linear,left top, right bottom, from(#a1f1a3), to(#3974d5));
  }

  .__default_dot {
    display: inline-block;
    background: #fff;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2);
    border-radius: 100px;
  }
  .__dot_x {
    margin-top: -3px;
    right: 0;
    width: 8px;
    height: 14px;
  } 
  .__dot_y {
    margin-left: -3px;
    margin-top: -5px;
    top: 0;
    width: 14px;
    height: 8px;
  }
</style>


