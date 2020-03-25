import { interpolateString } from 'd3-interpolate';
import { Selection, BaseType } from 'd3-selection';
import { transition } from 'd3-transition';

function tweenDash() {
    // this 指向当前需要执行动画的 dom 元素，如折线的 path 元素

    let l = this.getTotalLength(),
        // 获取当前 path 的总长度

        i = interpolateString("0," + l, l + "," + 0);
    // 动画 name stroke-dasharray
    // 虚线，由一系列数字组成，数字个数为偶数(负责会自动重复一遍使其为偶数),表示线长-间隙-线长-间隙..
    return function (t: any) { return i(t); };
}
function circleChange(container: Selection<BaseType, unknown, null, undefined>, radius: number) {
    container
        .transition()
        .duration(600)
        .attr('r', radius)
}
function animationType() {
    const t = transition()
        .ease();
    return t;
}
export { tweenDash, circleChange, animationType }