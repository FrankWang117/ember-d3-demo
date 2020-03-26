
class Size {
    private width: number | string = 100;
    private height: number | string = 100;
    private padding: any = {
        pt: 0,
        pr: 0,
        pb: 0,
        pl: 0
    }
    constructor(w: number | string, h: number | string) {
        this.width = w;
        this.height = h;
    }
    public setWidth(w: number) {
        this.width = w
    }
    public setHeight(h: number) {
        this.height = h
    }
    public getWidth() {
        return this.width;
    }
    public getHeight() {
        return this.height;
    }
    public getPadding() {
        return this.padding;
    }
    public setPadding(padding: any = this.padding) {
        let { top: pt = 0, right: pr = 0, bottom: pb = 0, left: pl = 0 } = padding;

        this.padding = { pt, pr, pb, pl }

    }
    public placeHolderMethod() {
        return 'do something'
    }

}
export default Size;