InputRange 提供了 react 组件，你可以通过以下方式来使用
```html
<template>
  <div>
    <Slide
      :direction="x"
      :width="width"
      :height="height"
      :default_value="opacity"
      :background_style="background_style"
      :progress_style="progress_style"
      :oninput="oninput"
      :onchange="onchange"
      :onload="onload"
      :onerror="onerror"
      :options="slide_options"/>
  </div>
</template>

<script>
  import Slide from 'input-range/build/vue';
  export default {
    data: () => ({
      width: '300px',
      height: '50px',
      background_style: {
        background: 'rgba(0, 0, 0, .5)',
      },
      progress_style: {
        background: '#fff',
      },
      slide_options: {
        prohibit_click: true,
      }
    }),
    methods: {
      oninput (value, progress_el, slide) {
        // ...
      },
      onchange (value, progress_el, slide) {
        // ...
      },
      onload (slide /* 如果加载失败，slide 会是 false */) {
        // ...
      },
      onerror (msg, stack) {
        // ...
      }
    },
    components: { Slide },
  }
<script>
```

## props
除了 `width` 和 `height`，其余的都是可选的

|    Name    | Description | Type | Default |
|------------|-------------|------|---------|
| width | slide bar 的宽度 | string | undefined |
| height | slide bar 的高度 | string | undefined |
| zIndex | container 的 zIndex | number | 99 |
| direction | slide 的 direction | 'x' \|\| 'y' | 'x' |
| default_value | 默认值 | string | '0' |
| background_style | 背景条的样式 | Object | {} |
| progress_style | slide bar 的样式 | Object | {} |
| dot_style | 按钮的样式 | Object | {} |
| onload | slide 初始化成功后触发 | Function | undefined |
| oninput | InputRange oninput | Function | undefined |
| onchange | InputRange onchange | Function | undefined |
| onerror | InputRange onerror | Function | undefined |
| options | InputRange opthins | Object | undefined |

具体详细的用法可以看[这里](../example/vue)