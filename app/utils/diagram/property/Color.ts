import { color,RGBColor, HSLColor} from 'd3-color';

class Color {
    private r:number = 0
    private g: number = 0;
    private b: number = 0;
    private a: number = 1;
    private rgb: RGBColor | HSLColor | null = null
    private rgba: RGBColor | HSLColor | null = null
    private hex: string | undefined = '';

    constructor(r:number,g:number,b:number,a?:number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a || 1
    }
    public RGB():RGBColor | HSLColor | null {
        let {r,g,b} = this
        this.rgb = color(`rgb(${r},${g},${b})`)
        return this.rgb;
    }
    public RGBA():RGBColor | HSLColor | null  {
        let {r,g,b,a} = this;
        this.rgba = color(`rgba(${r},${g},${b},${a})`)
        return this.rgba;
    }
    public HEX() {
        let {r,g,b} = this;
        this.hex = color(`rgb(${r},${g},${b})`)?.hex()
        return this.hex;
    }
}
export default Color