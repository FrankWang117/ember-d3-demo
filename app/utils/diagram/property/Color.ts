import { color, RGBColor, HSLColor } from 'd3-color';

class Color {
    private r: number = 0
    private g: number = 0;
    private b: number = 0;
    private opacity: number = 1;
    private colorObj: RGBColor | HSLColor 
    private rgb: string
    private hex: string = '';

    constructor(colorArr: string | number[]) {
        if (typeof colorArr === 'string') {
            this.colorObj = <RGBColor>color(<string>colorArr)
        } else {
            this.r = <number>colorArr[0]
            this.g = <number>colorArr[1]
            this.b = <number>colorArr[2]
            this.opacity = colorArr[3] ? <number>colorArr[3] : 1;
            this.colorObj = (<RGBColor>color(`rgb(${this.r},${this.g},${this.b})`))
            
            this.colorObj.opacity = this.opacity
        }
        this.hex = this.colorObj.hex();
        this.rgb = this.colorObj.toString()
    }
    public RGB(): string {
        return this.rgb;
    }
    public HEX(): string {
        return this.hex;
    }
}
export default Color