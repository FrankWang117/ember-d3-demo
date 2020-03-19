class Rotation {
    constructor(d:number) {
        this.degree = d;
    }
    private degree:number
    public setDegree(d:number) {
        this.degree = d
    }
    public getDegree() {
        return this.degree;
    }
}
export default Rotation;