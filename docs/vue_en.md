InputRange provided vue component, you can use by following way.

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
  import Slide from 'input-range/vue';
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
      onload (slide /* If loading fail, slide will be false. */) {
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
Except `width` and `height`, the rest are optional.

|    Name    | Description | Type | Default |
|------------|-------------|------|---------|
| width | width of slide bar | string | undefined |
| height | height of slide bar | string | undefined |
| zIndex | zIndex of container | number | 99 |
| direction | direction of slide | 'x' \|\| 'y' | 'x' |
| default_value | default value | string | '0' |
| background_style | style of background bar | Object | {} |
| progress_style | style of slide bar | Object | {} |
| dot_style | style of button | Object | {} |
| onload | triggered after slide is initialized successfully | Function | undefined |
| oninput | InputRange oninput | Function | undefined |
| onchange | InputRange onchange | Function | undefined |
| onerror | InputRange onerror | Function | undefined |
| options | InputRange opthins | Object | undefined |

Detailed usage can be seen [here](../example/vue)