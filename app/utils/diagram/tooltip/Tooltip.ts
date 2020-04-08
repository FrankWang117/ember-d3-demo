import { clientPoint, event, Selection, BaseType, selectAll } from 'd3-selection';
import { iTooltip } from "../../interface/tooltip";

class D3Tooltip implements iTooltip {
    isShow: boolean = false;
    content: string = "";
    position: number[] = []
    gap: number[] = [24, 24]
    // 图表的容器，svg 的容器。
    // tooltip 与 svg 同一层级。
    private container: Selection<BaseType, unknown, HTMLElement, null>
    private tooltip: Selection<BaseType, unknown, HTMLElement, null>
    private data: any = null;
    private dimensions: string[] = []
    constructor(container: Selection<BaseType, unknown, HTMLElement, null>,
        className: string | string[] = "") {
        this.container = container;
        const tooltip = container.append('div');
        let cn = this.getClass(className + ' bp-tooltip');

        tooltip.classed(cn, true);
        this.tooltip = tooltip;
        this.hidden();
        this.updatePosition([0,0])
    }
    public show() {
        this.tooltip.classed('d-none',false)
            .style('display','block')
    }
    public hidden() {
        this.tooltip.classed('d-none',true)
            .style('display','none')
    }
    public remove() {
        console.log("remove")
        this.hidden();

        this.container.select('.bp-tooltip').remove()
    }
    private getClass(className: string | string[]): string {
        let result: string = ""
        if (!className || className.length == 0) {
            return result;
        }
        switch (Object.prototype.toString.call(className)) {
            case '[object String]':
                result = (className as string);
                break;
            case '[object Array]':
                result = (className as string[]).join("")
                break;
            default:
                break;
        }
        // 需配合 bootstrap，如果没有 bootstrap ，需要设置class d-none 为 display：none 
        return result;
    }
    public setCurData(data: any) {
        this.data = data;
        // const self = this;
        // const children = this.container.select('svg');
        // children.on('mousemove', this.throttle(function () {
        //     if (event) {
        //         let p = clientPoint(this, event);
        //         self.updatePosition(p)
        //         // TODO 可根据与四个边框的距离
        //         // 合理配置提示框在鼠标的方位
        //     }
        // }, 50, 100))
    }
    public setCurDimensions(data:string[]) {
        this.dimensions = data
    }
    public setContent(fn: Function) {
        const content = fn.call(null, this.data,this.dimensions)
        this.tooltip.html(content)

        this.tooltip
            .style("position", "absolute")
    }
    public updatePosition(p: number[]) {
        this.position = p;
        const { container, tooltip } = this;

        let containerSize = [parseInt(container.style('width')),
        parseInt(container.style('height'))]
        let tooltipSize = [parseInt(tooltip.style('width')),
        parseInt(tooltip.style('height'))];

        let restWidthSpace = containerSize[0] / 2;
        let restHeightSpace = containerSize[1] / 2;
        let resultPosition = [p[0], p[1]];
        switch (true) {
            case p[0] > restWidthSpace:
                resultPosition[0] = p[0] - tooltipSize[0] - this.gap[0];
                // this.moveTo(p[0]-tooltipSize[0]-this.gap[0],p[1]+this.gap[1])
                break;
            case p[0] <= restWidthSpace:
                resultPosition[0] = p[0] + this.gap[0];
                // resultPosition[1] = p[1] + this.gap[1];
                // this.moveTo(p[0] + this.gap[0], p[1] + this.gap[1])
                break;
            default:
                break;
        }
        switch (true) {
            case p[1] > restHeightSpace:
                resultPosition[1] = p[1] - tooltipSize[1] - this.gap[1];
                break;
            case p[1] <= restHeightSpace:
                resultPosition[1] = p[1] + this.gap[1];
                break;
            default:
                break;
        }
        this.moveTo(resultPosition[0], resultPosition[1])
    }
    private moveTo(x: number, y: number) {
        this.tooltip
            .transition()
            .duration(300)
            .style('left', `${x}px`)
            .style('top', `${y}px`)
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
