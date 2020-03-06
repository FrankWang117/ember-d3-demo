import { iStylePadding } from '../interface/style';
import { select ,Selection,BaseType} from 'd3-selection';

class Layout {
    private padding: iStylePadding = {
        pt: 24,
        pr: 24,
        pb: 24,
        pl: 24
    }
    private width: number | string = "100%"
    private height: number | string = "100%"
    private container: Selection<BaseType,unknown,HTMLElement,null> 
    constructor(querySelectorValue:string) {
        let container = select(querySelectorValue)
        this.container = container
        this.width = parseInt(container.style("width"))
        this.height = parseInt(container.style("height"))
    }
    public getPadding() {
        return this.padding
    }
    public setPadding(t: number, r: number, b: number, l: number): void {
        let padding = this.padding
        padding.pt = t === 0 || t ? t : padding.pt
        padding.pr = r === 0 || r ? r : padding.pr
        padding.pb = b === 0 || b ? b : padding.pb
        padding.pl = l === 0 || l ? l : padding.pl
        this.padding = padding
    }
    public getWidth() {
        return this.width
    }
    public setWidth(w: number | string) {
        this.width = w
    }
    public getHeight() {
        return this.height
    }
    public setHeight(h: number | string) {
        this.height = h
    }
    public getContainer() {
        return this.container
    }
}

export default Layout