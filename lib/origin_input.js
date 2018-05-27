export class Slide {
  constructor ({
    el, 
    direction, 
    pointerEvents = false,
    touchArea = 100,
    clickElIndex = 0,
    pointTouchArea = {}
  }) {
    if (!el) { return }
    if (this.typeOf(el) === '[object String]') {
      el = document.querySelector(el)
    }
    
    this.onchange = _ => {}
    this.oninput  = _ => {}
    this.param = {dom: el, direction, pointerEvents, touchArea, clickElIndex}
    if (Object.keys(pointTouchArea).length) {
      this.expandTouch(el, pointTouchArea)
    }
    this.initStyle()
  }

  init () {
    const {dom, direction, touchArea, clickElIndex, expandTouchDom} = this.param
    const parent      = dom.parentElement
    const initEventFn = this.mousedown()
    const nowPosition = this.nowPosition(parent)

    const reviseW     = this.getW(dom) / 2
    const reviseH     = this.getH(dom) / 2
    
    const totalX      = this.getW(parent.parentElement)
    const totalY      = this.getH(parent.parentElement)

    // 剩下的的长度
    const lastX       = totalX * (1 - nowPosition)
    const lastY       = totalY * (1 - nowPosition)

    const clickInstance = this.setClickPosition(parent)
    parent.value = nowPosition
    
    // 移动端与客户端添加事件
    dom.onmousedown = initEventFn
    dom.addEventListener('touchstart', initEventFn)
    // 如果有点击范围的扩展
    if (expandTouchDom) {
      expandTouchDom.onmousedown = initEventFn
      expandTouchDom.addEventListener('touchstart', initEventFn)
    }
    this.param = {
      dom, parent, totalX, totalY, direction, reviseH, reviseW, clickElIndex,
      lastX, lastY, nowPosition, initEventFn, touchArea, clickInstance
    }
  }

  expandTouch (dom, {x, y}) {
    typeof x === 'number' && (x += 'px')
    typeof y === 'number' && (y += 'px')
    const div = document.createElement('div')
    const parent = dom.parentElement
    let first = true
    let cssText = `
      width:${x};height:${y};
      position:absolute;
      pointer-events:auto;
      z-index:998;`
    if (this.param.direction === 'X') {
      cssText += `top:calc(50% - ${y} / 2);right:calc(-${x} / 2);`
    } else {
      cssText += `top:calc(-${y} / 2);left:calc(50% - ${x} / 2);`
    }

    this.watchDisplay(dom, ({oldValue}) => {
      const match = /^display:([^;]+)/.exec(oldValue)
      if (match && match[1]) {
        const displayValue = match[1].trim()
        div.style.display = displayValue === 'none' && !first
          ? 'block'
          : 'none'
        first = false
      }
    })
    div.style.cssText = cssText
    dom.style.zIndex = 999
    parent.appendChild(div)
    this.param.expandTouchDom = div
  }

  watchDisplay (dom, callback) {
    const MutationObserver = 
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver

    const observer = new MutationObserver((mutations) => callback(mutations[0]))
    observer.observe(dom, {
      attributes: true,
      attributeOldValue:true
    })
  }

  initStyle () {
    const {dom, pointerEvents, clickElIndex} = this.param
    if (pointerEvents) {
      dom.style.pointerEvents = 'auto'
      dom.parentElement.style.pointerEvents = 'none'
    }

    if (
      clickElIndex < 0 ||
      clickElIndex > dom.parentElement.parentElement.childElementCount - 1
    ) {
      throw new RangeError('【clickElIndex】 is not in the correct range.')
    }

    const position = getComputedStyle(dom.parentElement).position
    if (position === 'static') {
      dom.style.position = 'relative'
      return
    }
    dom.style.position = 'absolute'
  }

  mousedown () {
    const self = this
    return function (e) {
      const {clientX, clientY} = self.getClientXY(e)
      const {dom, parent, clickInstance} = self.param
      const touchmove = self.mousemove()
      // 清除点击事件，避免干扰
      clickInstance.remove()
      self.param.X = clientX - dom.offsetLeft
      self.param.Y = clientY - dom.offsetTop

        if (e.type !== 'touchstart') {
          document.onmousemove = self.mousemove()
          document.onmouseup = function (e) {
            self.fire(parent, 'change')
            document.onmousemove = null
            document.onmouseup   = null
            self.mouseupOrTouchend(e)
          }
          return
        }

        // 移动端
      document.addEventListener('touchmove', touchmove)
      document.addEventListener('touchend', touchend)
      function touchend (e) {
        self.fire(parent, 'change')
        document.removeEventListener('touchmove', touchmove)
        document.removeEventListener('touchend', touchend)
        self.mouseupOrTouchend(e)
      }
    }
  }

  mouseupOrTouchend (e) {
    const {totalX, totalY, parent} = this.param
    const nowPosition = this.nowPosition(parent)
    const time = e.type === 'touchend' ? 15 : 0
    this.param.lastX  = totalX * (1 - nowPosition)
    this.param.lastY  = totalY * (1 - nowPosition)
    // 在touchend事件结束后重新加上点击事件
    setTimeout(_ => this.setClickPosition(parent), time)
  }

  mousemove () {
    const self = this
    return function (e) {
      const type = e.type === 'touchmove'
      !type && e.preventDefault()
      const {dom, totalX, totalY, reviseH, reviseW, lastX, lastY, direction, X, Y} = self.param
      const {clientX, clientY} = self.getClientXY(e)
        self.param.left = clientX - X
        self.param.top  = clientY - Y

        if (direction === 'X') {
          if (self.param.left < -reviseW)
              self.param.left = -reviseW
          if (self.param.left > totalX -reviseW)
              self.param.left = totalX -reviseW
        }
        
        // 往上为负，下为正 
        if (direction === 'Y') {
          // 移动的距离不能大于限定的长度
          const alrY = totalY - lastY
          if (self.param.top > alrY - reviseH / 2) 
              self.param.top = alrY - reviseH / 2
          if (self.param.top < -(lastY + reviseH / 2))
              self.param.top = -(lastY + reviseH / 2)
        }
      self.distance()
    }
  }

  removeInitEvent () {
    let initEventFn
    if (initEventFn = this.param.initEventFn) {
      this.param.dom.onmousedown = null
      this.param.dom.removeEventListener('touchstart', initEventFn)
      if (this.param.expandTouchDom) {
        this.param.expandTouchDom.onmousedown = null
        this.param.expandTouchDom.removeEventListener('touchstart', initEventFn)
      }
    }
  }

  distance () {
    let {totalX, totalY, left, top, reviseH, reviseW, direction, lastY, touchArea} = this.param
    if (direction === 'X') {
      if (top > -touchArea && top < touchArea) {
        const nowVal  = left + reviseW
        const precent = nowVal / totalX
        this.changeAttr('width', precent)
      }
    }

    if (direction === 'Y') {
      if (left > -touchArea && left < touchArea) {
        const alrY    = totalY - lastY - reviseH / 2
        const precent = (alrY - top) / totalY
        this.changeAttr('height', precent)
      }
    }
  }

  changeAttr (attr, precent) {
    const {dom, parent} = this.param
    parent.style[attr]  = precent * 100 + '%'
    parent.value        = precent
    this.fire(parent, 'input')
  }

  typeOf (val) {
    return Object.prototype.toString.call(val)
  }

  nowPosition (parent) {
    const direction   = this.param.direction
    const grandfather = parent.parentElement
    if (direction === 'X') {
      const width   = this.getW(parent)
      const parentW = this.getW(grandfather)
      return width / parentW
    }

    if (direction === 'Y') {
      const height  = this.getH(parent)
      const parentH = this.getH(grandfather)
      return height / parentH
    }
  }

  setClickPosition (parent) {
    let {direction, clickElIndex} = this.param
    let randomId
    const sibling = parent.parentElement.children[clickElIndex]
    if (sibling) {
      sibling.onclick = e => {
        const selfRandomId = randomId = this.randomId()
        const {layerX, layerY} = e
        let precent, attr
        if (direction === 'X') {
          precent = layerX / this.getW(sibling)
          attr = 'width'
        }
        if (direction === 'Y') {
          precent = 1 - layerY / this.getH(sibling)
          attr = 'height'
        }
        parent.style.transition = 'all 0.2s'
        this.removeInitEvent()
        this.changeAttr(attr, precent)
        this.fire(parent, 'change')
        setTimeout(_ => {
          if (selfRandomId !== randomId) return
          parent.style.transition = ''
          this.init()
        }, 205)
      }
      return {
        remove: _ => sibling.onclick = null
      }
    }
    return {remove: _ => {}}
  }

  getH (dom) {
    return parseInt(getComputedStyle(dom).height)
  }

  getW (dom) {
    return parseInt(getComputedStyle(dom).width)
  }

  getClientXY (e) {
    const type = e.type.includes('touch')
    const clientX = type ? e.changedTouches[0].clientX : e.clientX
    const clientY = type ? e.changedTouches[0].clientY : e.clientY
    return {clientX, clientY}
  }

  rounding (tep) {
    if (tep < 0 || tep > 1) {
      throw new RangeError('The 【arg】 must be between 0 and 1.')
    }
    let percent   = this.param.parent.value
    let remainder = percent % tep
    return percent - remainder + (remainder >= tep / 2 ? tep : 0)
  }

  randomId (min = 0, max = 100000) {
    const number = Math.random() * (max - min + 1) + min
    return parseInt(number)
  }

  fire (el, type) {
    const event = new Event(type)
    event.value = el.value
    el.dispatchEvent(event)
    this['on' + type](el.value, el)
  }
}