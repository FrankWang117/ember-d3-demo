import { Selection } from 'd3-selection';

function axisTransform_old(dir: string, grid: any) {
    let distance: number[] = [0, 0];
    // let svg = this.layout.getSvg();
    let { padding, height, width } = grid;
    let yAxisWidth = 0; //getAxisSide(svg.select('.y-axis'));
    let xAxisHeight = 0;//getAxisSide(svg.select('.x-axis'), 'height');

    switch (dir) {
        case 'bottom':
            distance = [0, height - padding.pb - xAxisHeight];
            break;
        case 'top':
            distance = [padding.pl, padding.pt];
            break;
        case 'right':
            distance = [width - padding.pr - yAxisWidth, 0];
            break;
        case 'left':
            distance = [padding.pl + yAxisWidth, 0];
            break;
        default:
            break;
    }

    return distance

}
function getAxisSide(selection: Selection<SVGSVGElement, unknown, HTMLElement, null>, prop: string = "width") {
    if (selection.node() === null) {
        return 0;
    }
    return selection.node().getBBox()[prop];

}
function axisTransform(axisOpt: any, grid: any, svg: any) {
    let distance: number[] = [0, 0];
    let { padding, height, width } = grid;
    let yAxisWidth = getAxisSide(svg.select('.y-axis'));
    let xAxisHeight = getAxisSide(svg.select('.x-axis'), 'height');

    switch (axisOpt.position) {
        case 'bottom':
            distance = [0, height - padding.pb - xAxisHeight];
            break;
        case 'top':
            distance = [padding.pl, padding.pt];
            break;
        case 'right':
            distance = [width - padding.pr - yAxisWidth, 0];
            break;
        case 'left':
            distance = [padding.pl + yAxisWidth, 0];
            break;
        default:
            break;
    }
    return distance

}
export { axisTransform }