import * as tslib_1 from "tslib";
import React, { Component } from 'react';
import { createSlide } from '../index';
var SlideComponent = (function (_super) {
    tslib_1.__extends(SlideComponent, _super);
    function SlideComponent(props) {
        return _super.call(this, props) || this;
    }
    SlideComponent.prototype.componentDidMount = function () {
        var _a = this.props, onload = _a.onload, onerror = _a.onerror, oninput = _a.oninput, onchange = _a.onchange, _b = _a.direction, direction = _b === void 0 ? 'x' : _b, _c = _a.options, options = _c === void 0 ? {} : _c;
        if (!this.Dot && onload) {
            onload(false);
            return;
        }
        var slide = createSlide(tslib_1.__assign({ point: this.Dot, direction: direction }, options));
        onerror && (slide.onerror = onerror);
        oninput && (slide.oninput = oninput);
        onchange && (slide.onchange = onchange);
        slide.init();
        onload && onload(slide);
    };
    SlideComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.background_style, background_style = _b === void 0 ? {} : _b, _c = _a.progress_style, progress_style = _c === void 0 ? {} : _c, _d = _a.dot_style, dot_style = _d === void 0 ? {} : _d, _e = _a.default_value, default_value = _e === void 0 ? 0 : _e, _f = _a.direction, direction = _f === void 0 ? 'x' : _f, _g = _a.Zindex, Zindex = _g === void 0 ? 99 : _g;
        return (React.createElement("div", { style: get_container_style(this.props, Zindex) },
            React.createElement("span", { style: get_background_style(background_style, direction) }),
            React.createElement("span", { style: get_progress_style(progress_style, direction, Number(default_value)) },
                React.createElement("i", { style: get_dot_style(dot_style, direction), ref: function (ref) { ref && (_this.Dot = ref); } }))));
    };
    return SlideComponent;
}(Component));
export default SlideComponent;
function get_container_style(_a, Zindex) {
    var width = _a.width, height = _a.height, _b = _a.container_style, container_style = _b === void 0 ? {} : _b;
    return tslib_1.__assign({ position: 'relative', Zindex: Zindex,
        width: width,
        height: height }, container_style);
}
function get_background_style(style, direction) {
    var init_background_style = direction === 'x'
        ? { width: '100%' }
        : { height: '100%' };
    return tslib_1.__assign({}, default_span_style(direction), init_background_style, { background: '#366d68' }, style);
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
    return tslib_1.__assign({}, default_span_style(direction), init_progress_style, { background: '-webkit-gradient(linear,left top, right bottom, from(#a1f1a3), to(#3974d5))' }, style);
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
    return tslib_1.__assign({ display: 'inline-block', background: '#fff', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2)', borderRadius: '100px' }, init_dot_style, style);
}
function default_span_style(direction) {
    var init_style = {
        position: 'absolute',
        borderRadius: '10px',
    };
    return direction === 'x'
        ? tslib_1.__assign({}, init_style, { top: 0, left: 0, height: '8px' }) : tslib_1.__assign({}, init_style, { width: '8px' });
}
