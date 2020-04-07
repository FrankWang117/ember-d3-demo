import {Selection} from 'd3-selection'
class DimensionFSM {
    private currentState:string = ""
    private dimensions:any[] = []

    constructor(defaultState:string) {
        this.currentState = defaultState
    }
    public bindEvent(target:Selection<any,unknown,any,any>,event:Function) {
        target.on('click',event)
    }
    public transition() {

    }
    public setDimensions(dimensions:any[]) {
        this.dimensions = dimensions
    }
}
export default DimensionFSM;