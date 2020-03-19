import {Size,Position,Rotation,Color} from '../index';

class HistogramProterty  {
    hitSize: Size | null = null
    relativePos: Position | null = null
    rotate: Rotation | null = null
    colorPool: Color[] = []
    setSize(x:number,y:number) {
        let size = new Size(x,y)
        this.hitSize = size;
    }
    resize() {

    }
    resetRotate() {

    }
    transform() {
        
    }
}

export default HistogramProterty