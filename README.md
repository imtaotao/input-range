# Input range 🎉

InputRange 是一个滑动条插件，他模拟原生的 input range 组件，他默认让你可以高度自定义化`dom`结构和`css`样式，对于不想自己写`dom`结构和`css`样式的，也提供了`react`组件和`vue`组件，具体的用法你可以看[这里][example]

## 关于 react 和 vue 组件
+ [react slide bar][react_doc]
+ [vue slide bar][vue_doc]

## 如何使用
InputRange 有两种方式进行初始化
```js
  const { Slide, createSlide } from 'input-range'

  // 第一种
  const slide = new Slide(options)
  slide.init()

  // 第二种
  const slide = createSlide(options)
  slide.init()
```
当`slide`实例被创建后，你可以在适当的时候进行初始化，比如当某个`dom`元素最开始被隐藏，某个时刻被显示出来的时候

## options 描述
`options` 除了 `point` 之外，都是可选的

|    Name    | Description | Type | Default |
|------------|-------------|------|---------|
| point | 滑动条按钮 | element \|\| string | undefined |
| direction  | 滑动条活动方向 | 'x' \|\| 'y' | 'x' |
| limit_area | 拖动时候限制范围 | number | 100 |
| pointer_event | 是否给滑动条`style`添加`pointer-events`属性 | boolean | true |
| prohibit_click | 是否禁止点击滑动条 | boolean | false |
| prohibit_move | 是否禁止拖动滑动条 | boolean | false |
| click_el_index | 点击的时候，`container` 的第几个元素触发`click`事件，从`0`开始 | number | 0 |
| expand_touch_area | 扩展点击范围 | Object | undefined |

### expand_touch_area 描述
|    Name    | Description | Type |
|------------|-------------|------|
| width | 宽 | number \|\| string |
| height | 高 | number \|\| string |


## 实例属性
### value
`slide.value` 记录着当前滑动条的值，值为 0 - 1。需要另外说明的是，slide 会在 init 的时候根据 slide progress 的 css 值进行默认值的设定，slide 没有提供 default value 接口，因此你可以通过 `html` 结构和 `dispatch` 两种方式，来实现默认值
```html
  <div class="container">
    <span class="background"></span>
    <span class="progress">
      <i class="dot"></i>
    </span>
  </div>

  <style>
    .progress {
      width: 30%;
    }
  </style> 

  <script>
    // 如果 direction 为 'x' 
    const slide = new Slide(options)
    slide.init()
    slide.value // 0.3
  </script>  
```
or
```js
  const slide = new Slide(options)
  slide.init()
  slide.dispatch('change', 0.1)
```

## api
+ #### [`init()`][init]
+ #### [`dispatch(event_type, value, is_animate)`][dispatch]
+ #### [`prohibit_click(prohibit)`][prohibit_click]
+ #### [`prohibit_move(prohibit)`][prohibit_move]

## 钩子函数
+ #### [`oninput`][oninput]
+ #### [`onchange`][onchange]
+ #### [`onerror`][onerror]

## init
你可以在任何时候使用`init`方法进行参数重置
```js
  const slide = new Slide(options)
  slide.init()
```

## dispatch
你可以手动触发事件，没错，`dispatch` 一下
```js
  // event type 只能为 input 或者 change
  // value 只能在 0 - 1 之间取值
  // 你可选择是否用过度动画
  slide.dispatch('input', 1, true)
```

## prohibit_click
此方法用来禁止点击 slide bar 或者 取消禁止点击 slide bar
```js
  slide.prohibit_click(true)
  // or
  slide.prohibit_click(false)
```

## prohibit_move
此方法用来禁止滑动 slide bar 或者 取消禁止滑动 slide bar
```js
  slide.prohibit_move(true)
  // or
  slide.prohibit_move(false)
```

## oninput
你可以把这个方法类似比作原生 `input range` 组件的 `input` 事件的回调
```js
  slide.oninput = function(value, progress_el, slide) {
    ...
  }
```
你还可以通过给 `html` 元素注册 input 事件来实现相同的效果
```html
  <span class="progress" id="p"></span>

  <script>
    p.addEventListener('input', e => {
      const value = e.value
      ...
    })
  </script>
``` 

## onchange
`onchange` 钩子函数与 `oninput` 类似，同样是模拟原生 `change` 事件，除了需要把 `input` 换成 `change` 之外

## onerror
`onerror` 函数用来接收 InputRange 发出的错误
```js
  slide.onerror = function (err_msg, stacks) {
    ...
  }
```

[example]:./example
[react_doc]:./docs/react_zh.md
[vue_doc]:./docs/vue_zh.md

[init]:#init
[dispatch]:#dispatch
[prohibit_click]:#prohibit_click
[prohibit_move]:#prohibit_move
[oninput]:#oninput
[onchange]:#onchange
[onerror]:#onerror