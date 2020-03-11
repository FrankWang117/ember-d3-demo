import { select, clientPoint, event, Selection, BaseType } from 'd3-selection';
import { iTooltip } from "../interface/tooltip";

class D3Tooltip implements iTooltip {
    show: boolean = false;
    content: string = "";
    position: number[] = []
    // 图表的容器，svg 的容器。
    // tooltip 与 svg 同一层级。
    private container: Selection<BaseType, unknown, HTMLElement, null>
    private tooltip: Selection<BaseType, unknown, HTMLElement, null>
    private data: any = null;
    constructor(container: Selection<BaseType, unknown, HTMLElement, null>,
        className: string | string[] = "") {
        this.container = container;
        const tooltip = container.append('div');
        let cn = this.getClass(className + ' bp-tooltip');

        tooltip.classed(cn, true);
        this.tooltip = tooltip;

    }

    private getClass(className: string | string[]): string {
        let result: string = ""
        if (!className || className.length == 0) {
            return result;
        }
        switch (Object.prototype.toString.call(className)) {
            case '[object String]':
                result = <string>className;
                break;
            case '[object Array]':
                result = (<string[]>className).join("")
                break;
            default:
                break;
        }
        // 需配合 bootstrap 
        return result + " d-none";
    }
    public setCurData(data: any) {
        this.data = data;
        const self = this
        this.container.select('svg').on('mousemove', this.throttle(function () {
            if (event) {
                let p = clientPoint(this, event);
                self.setPosition(p)
                // TODO 可根据与四个边框的距离
                // 合理配置提示框在鼠标的方位
            }
        }, 50, 100))
    }
    public setContent(fn: Function) {
        const content = fn.call(null, this.data)
        this.tooltip.html(content)

        this.tooltip
            .style("position", "absolute")
    }
    public setPosition(p: number[]) {
        this.position = p;
        this.tooltip
            .transition()
            .duration(300)
            .style("left", `${this.position[0]}px`)
            .style('top', `${this.position[1]}px`)
    }
    public getContainer() {
        return this.container
    }
    public getTooltip() {
        return this.tooltip
    }
    public throttle(fn: Function, delay: number, mustRunDelay: number) {
        let timer: any = null;
        let t_start: number = 0;
        return function () {
            const context = this,
                args = [...arguments],
                t_curr = +new Date();
            clearTimeout(timer);
            if (!t_start) {
                t_start = t_curr
            }
            if (t_curr - t_start >= mustRunDelay) {
                fn.apply(context, args);
                t_start = t_curr
            } else {
                timer = setTimeout(function () {
                    fn.apply(context, args)
                }, delay)
            }
        }
    }
}
export default D3Tooltip
