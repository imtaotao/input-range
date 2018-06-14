var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import React, { Component } from 'react';
import { createSlide } from '../index';
var SlideComponent = (function (_super) {
    __extends(SlideComponent, _super);
    function SlideComponent(props) {
        return _super.call(this, props) || this;
    }
    SlideComponent.prototype.componentDidMount = function () {
        var _a = this.props, onload = _a.onload, onerror = _a.onerror, oninput = _a.oninput, onchange = _a.onchange, _b = _a.direction, direction = _b === void 0 ? 'x' : _b, _c = _a.options, options = _c === void 0 ? {} : _c;
        if (!this.Dot && onload) {
            onload(false);
            return;
        }
        var slide = createSlide(__assign({ point: this.Dot, direction: direction }, options));
        onerror && (slide.onerror = onerror);
        oninput && (slide.oninput = oninput);
        onchange && (slide.onchange = onchange);
        slide.init();
        onload && onload(slide);
    };
    SlideComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.background_style, background_style = _b === void 0 ? {} : _b, _c = _a.progress_style, progress_style = _c === void 0 ? {} : _c, _d = _a.dot_style, dot_style = _d === void 0 ? {} : _d, _e = _a.default_value, default_value = _e === void 0 ? 0 : _e, _f = _a.direction, direction = _f === void 0 ? 'x' : _f, _g = _a.zIndex, zIndex = _g === void 0 ? 99 : _g;
        return (React.createElement("div", { style: get_container_style(this.props, zIndex) },
            React.createElement("span", { style: get_background_style(background_style, direction) }),
            React.createElement("span", { style: get_progress_style(progress_style, direction, Number(default_value)) },
                React.createElement("i", { style: get_dot_style(dot_style, direction), ref: function (ref) { ref && (_this.Dot = ref); } }))));
    };
    return SlideComponent;
}(Component));
export default SlideComponent;
function get_container_style(_a, zIndex) {
    var width = _a.width, height = _a.height, _b = _a.container_style, container_style = _b === void 0 ? {} : _b;
    return __assign({ position: 'relative', zIndex: zIndex,
        width: width,
        height: height }, container_style);
}
function get_background_style(style, direction) {
    var init_background_style = direction === 'x'
        ? { width: '100%' }
        : { height: '100%' };
    return __assign({}, default_span_style(direction), init_background_style, { background: '#366d68' }, style);
}
function get_progress_style(style, direction, default_value) {
    default_value = Math.max(Math.min(default_value, 1), 0);
    var init_progress_style = direction === 'x'
        ? {
            width: default_value * 100 + "%",
            paddingLeft: '7px',
        }
        : {
            height: 0,
            bottom: 0,
        };
    return __assign({}, default_span_style(direction), init_progress_style, { background: '-webkit-gradient(linear,left top, right bottom, from(#a1f1a3), to(#3974d5))' }, style);
}
function get_dot_style(style, direction) {
    var init_dot_style = direction === 'x'
        ? {
            marginTop: '-3px',
            right: 0,
            width: '8px',
            height: '14px',
        }
        : {
            marginLeft: '-3px',
            marginTop: '-5px',
            top: 0,
            width: '14px',
            height: '8px',
        };
    return __assign({ display: 'inline-block', background: '#fff', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2)', borderRadius: '100px' }, init_dot_style, style);
}
function default_span_style(direction) {
    var init_style = {
        position: 'absolute',
        borderRadius: '10px',
    };
    return direction === 'x'
        ? __assign({}, init_style, { top: 0, left: 0, height: '8px' }) : __assign({}, init_style, { width: '8px' });
}
