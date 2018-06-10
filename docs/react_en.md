InputRange provided react component, you can use by following way.

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

    onload (slide /* If loading fail, slide will be false. */) {
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
Except `width` and `height`, the rest are optional.

|    Name    | Description | Type | Default |
|------------|-------------|------|---------|
| width | width of slide bar | string | undefined |
| height | height of slide bar | string | undefined |
| zIndex | zIndex of container | number | 99 |
| direction | direction of slide | 'x' \|\| 'y' | 'x' |
| default_value | default value | string | '0' |
| container_style | style of container element | Object | {} |
| background_style | style of background bar | Object | {} |
| progress_style | style of slide bar | Object | {} |
| dot_style | style of button | Object | {} |
| onload | triggered after slide is initialized successfully | Function | undefined |
| oninput | InputRange oninput | Function | undefined |
| onchange | InputRange onchange | Function | undefined |
| onerror | InputRange onerror | Function | undefined |
| options | InputRange opthins | Object | undefined |

Detailed usage can be seen [here](../example/react)
