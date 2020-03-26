import {Size,Position,Rotation,Color} from '../index';

class HistogramProterty  {
    hitSize: Size = new Size(100,100)
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