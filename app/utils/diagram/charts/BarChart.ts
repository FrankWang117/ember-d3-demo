import Histogram from './Histogram';
import AxisBuilder from '../scale/AxisBuilder';
import { getAxisSide } from '../scale/axisTransform';
import { Selection } from 'd3-selection';
import {animationType} from '../animation/animation';

class BarChart extends Histogram {

    constructor(opt: any) {
        super(opt)
        // 格式化数据
        this.dataset = this.parseData(this.data.dataset)
    }
    draw(selection: Selection<any, unknown, any, any>) {
        // selection are chart container
        let grid = this.grid
        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)

        this.scale(svg);
        // 画 bar
        this.drawBar(svg);

    }
    scale(svg:Selection<any,unknown,any,any>) {
        // 画轴
        const yAxisIns = this.drawYaxis(svg);
        const xAxisIns = this.drawXaxis(svg);
        // 计算 x 轴 / y 轴的 高度/宽度,分别作为 offset 复制给 yOpt / xOpt
        let yAxisWidth = getAxisSide(svg.select(`.${this.yAxis.className}`));
        let xAxisHeight = getAxisSide(svg.select(`.${this.xAxis.className}`), 'height');
        this.resetOffset(this.xAxis, yAxisWidth)
        this.resetOffset(this.yAxis, xAxisHeight)

        this.updateYaxis(yAxisIns, svg);
        this.updateXaxis(xAxisIns, svg)
    }
    private drawBar(svg: Selection<any, unknown, any, any>) {
        let xScale = (<AxisBuilder>this.xAxisBuilder).getScale()
        let { grid, xAxis, yAxis, property: p } = this
        let yScale = (<AxisBuilder>this.yAxisBuilder).getScale();
        let barWidth = 16;
        const t = animationType();
        svg.selectAll('rect')
            .data(this.dataset)
            .enter()
            .append('rect')
            .classed('basic-bar', true)
            .attr("fill", p.colorPool[0].HEX())
            .attr('x', (d: any) => xScale(d[xAxis.dimension]) + xScale.bandwidth() / 2 - barWidth / 2)
            .attr('y', (_d: any) => (<number>grid.height) - grid.padding.pb - yAxis.offset)
            .attr('width', barWidth + "px")
            .attr('height', 0)
            .transition(t)
            .duration(4000)
            .attr('y', (d: any) => yScale(d[yAxis.dimension]))
            .attr('height', (d: any) => (<number>grid.height) - grid.padding.pt - yAxis.offset - yScale(d[yAxis.dimension]))

    }
}
export default BarChart;
