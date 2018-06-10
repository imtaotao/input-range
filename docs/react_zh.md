InputRange 提供了 react 组件，你可以通过以下方式来使用
```js
  import React, { Component } from 'react'
  import { Slide } from 'input-range/react'

  export default class SlideComponent extends Component {
    constructor (props) {
      super(props)
      this.container_style = {}
      // point style
      this.dot_style = {}
      // slide bar backgrond style
      this.background_style = {}
      // slide bar progress style
      this.progress_style = {}
      // Input Range options
      this.options = {}
    }

    onload (slide /* 如果加载失败，slide 会是 false */) {
      this.slide = slide
      // ...
    }

    onchange (value, progress_el, slide) {
      // ...
    }

    oninput (value, progress_el, slide) {
      // ...
    }

    onerror (msg, stack) {
      // ...
    }

    render () {
      return (
        <div>
          <Slide 
            width='300px'
            height='50px'
            direction='x'
            default_value='0.2'
            dot_style={this.dot_style}
            container_style={this.container_style}
            background_style={this.background_style}
            progress_style={this.progress_style}
            onload={this.onload.bind(this)}
            onerror={this.onerror.bind(this)}
            onchange={this.oninput.bind(this)}
            oninput={this.oninput.bind(this)}
            options={this.options}/>
        </div>
      )
    }
  }
```
## props
除了 `width` 和 `height`，其余的都是可选的 

|    Name    | Description | Type | Default |
|------------|-------------|------|---------|
| width | slide bar 的宽度 | string | undefined |
| height | slide bar 的高度 | string | undefined |
| zIndex | container 的 zIndex | number | 99 |
| direction | slide 的 direction | 'x' \|\| 'y' | 'x' |
| default_value | 默认值 | string | '0' |
| container_style | 容器元素的样式 | Object | {} |
| background_style | 背景条的样式 | Object | {} |
| progress_style | slide bar 的样式 | Object | {} |
| dot_style | 按钮的样式 | Object | {} |
| onload | slide 初始化成功后触发 | Function | undefined |
| oninput | InputRange oninput | Function | undefined |
| onchange | InputRange onchange | Function | undefined |
| onerror | InputRange onerror | Function | undefined |
| options | InputRange opthins | Object | undefined |

具体详细的用法可以看[这里](../example/react)