class Position {
    private x: number = 0;
    private y: number = 0;
    public remove(x:number,y:number) {
        this.x = x;
        this.y = y;
    }
    constructor(x:number,y:number) {
        this.x = x;
        this.y = y;
    }
    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }
}
export default Position;