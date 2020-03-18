
class Size {
    private width: number = 100;
    private height: number  = 100;
    constructor(w:number,h:number) {
        this.width = w;
        this.height = h;
    }
    public setWidth(w:number) {
        this.width = w
    }
    public placeHolderMethod() {
        return 'do something'
    }
    
}
export default Size;