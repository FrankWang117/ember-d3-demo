import { Selection } from 'd3-selection';

function getAxisSide(selection:Selection<SVGSVGElement, unknown, HTMLElement, null>,prop:string = "width") {
    console.log(selection)
    if(selection.node() === null) {
        return 0;
    }
    return selection.node().getBBox()[prop];

}
export {getAxisSide}