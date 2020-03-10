import { select, Selection, BaseType } from 'd3-selection';
import { iTooltip } from "../interface/tooltip";

class D3Tooltip implements iTooltip {
    show: boolean = false;
    content: string = "";
    position: number[] = []
    // 图表的容器，svg 的容器。
    // tooltip 与 svg 同一层级。
    private container: Selection<BaseType, unknown, HTMLElement, null>
    private tooltip: Selection<BaseType, unknown, HTMLElement, null>
    private data:any = null;
    constructor(container: Selection<BaseType, unknown, HTMLElement, null>,
        className: string | string[] = "") {
        this.container = container;
        const tooltip = container.append('div');
        this.tooltip = tooltip;
        let cn = this.getClass(className);

        tooltip.classed(cn, true)
    }

    private getClass(className: string | string[]): string {
        let result:string = ""
        if (!className || className.length == 0) {
            return result;
        }
        switch (Object.prototype.toString.call(className)) {
            case '[object String]':
                result =  <string>className;
                break;
            case '[object Array]':
                result =  (<string[]>className).join("")
                break;
            default:
                break;
        }
        // 需配合 bootstrap 
        return result + " d-none";
    }
    public setCurData(data:any) {
        this.data = data
    }
    public setContent(fn:Function) {
        const content = fn.call(null,this.data)
        this.tooltip.html(content)

        this.tooltip
        .style("position","absolute")
        .style("left",`${this.position[0]}px`)
        .style('top',`${this.position[1]}px`)
    }
    public setPosition(p:number[]) {
        this.position = p
    }
    public getContainer() {
        return this.container
    }
    public getTooltip() {
        return this.tooltip
    }
}
export default D3Tooltip
