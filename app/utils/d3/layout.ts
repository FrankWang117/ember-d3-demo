import { iStylePadding } from '../interface/style';
import { select, Selection, BaseType } from 'd3-selection';
const DEFAULT_GRID = {
    show: false,
    padding: {
        pt: 24,
        pr: 24,
        pb: 24,
        pl: 24
    },
    width: 'auto',
    height: 'auto',
    backgroundColor: "transparent"
}
class Layout {
    private padding: iStylePadding = {
        pt: 24,
        pr: 24,
        pb: 24,
        pl: 24
    }
    private width: number
    private height: number
    private container: Selection<BaseType, unknown, HTMLElement, null>
    private svg:Selection<SVGSVGElement,unknown,HTMLElement,null>
    private grid: any = DEFAULT_GRID
    constructor(querySelectorValue: string, grid?: any) {
        let container = select(querySelectorValue)
        this.container = container
        this.grid = { ...DEFAULT_GRID, ...grid }
        
        this.width = this.dealSide(this.grid.width)
        this.height = this.dealSide(this.grid.heigth,'height')
        this.grid = {...this.grid,width:this.width,height:this.height}
        console.log(this.width)
        this.svg = this.canvasBuilder()
    }
    // 获得当前 canvas 的宽高数值
    private dealSide(sideLen: number | string,prop:string = 'width'): number {
        let containerWidth = parseInt(this.container.style(prop));

        if (typeof sideLen === 'number') {
            return sideLen;
        }
        // string
        let numberWidth = parseFloat(<string>sideLen)
        if (Number.isNaN(numberWidth)) {
            return containerWidth
        }
        return numberWidth * 0.01 * containerWidth
    }
    public canvasBuilder() {
        let svg = this.container.append('svg')
            .attr("width", this.width)
            .attr("height", this.height)
            .style("background-color",this.grid.backgroundColor)

        return svg;
    }
    public setPadding(t: number, r: number, b: number, l: number): void {
        let padding = this.padding
        padding.pt = t === 0 || t ? t : padding.pt
        padding.pr = r === 0 || r ? r : padding.pr
        padding.pb = b === 0 || b ? b : padding.pb
        padding.pl = l === 0 || l ? l : padding.pl
        this.padding = padding
    }
    //setter
    public setWidth(w: number) {
        this.width = w
    }
    public setHeight(h: number) {
        this.height = h
    }
    // gettet
    public getGrid (){
        return this.grid
    }
    public getPadding() {
        return this.padding
    }
    public getWidth() {
        return this.width
    }
    public getHeight() {
        return this.height
    }
    public getContainer() {
        return this.container
    }
    public getSvg() {
        return this.svg
    }


}

export default Layout