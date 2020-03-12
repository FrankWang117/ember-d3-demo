
function getAxisSide(selection:any,prop:string = "width") {
    return selection.node().getBBox()[prop];

}
export {getAxisSide}