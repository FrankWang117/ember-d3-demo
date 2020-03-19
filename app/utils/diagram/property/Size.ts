
class Size {
    private width: number = 100;
    private height: number  = 100;
    private padding: any = {
        pt: 24,
        pr: 24,
        pb: 24,
        pl: 24
    }
    constructor(w:number,h:number) {
        this.width = w;
        this.height = h;
    }
    public setWidth(w:number) {
        this.width = w
    }
    public setHeight(h:number) {
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
    public placeHolderMethod() {
        return 'do something'
    }
    
}
export default Size;