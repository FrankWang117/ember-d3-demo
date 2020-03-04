import {iStylePadding} from './interface/style'

class InitSvgAttr {
    public pt:number = 24// padding top
    public pr:number = 24
    public pb: number = 24
    public pl: number
    constructor(padding:iStylePadding) {
        this.pt = padding.pt
        this.pr = padding.pr
        this.pb = padding.pb
        this.pl = padding.pl

    }
}