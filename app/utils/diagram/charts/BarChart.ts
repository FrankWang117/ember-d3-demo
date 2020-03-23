import Histogram from './Histogram';
import { min, max } from 'd3-array';
import AxisBuilder from '../scale/AxisBuilder';
import { axisTransform } from '../scale/axisTransform'
import { transition } from 'd3-transition';

class BarChart extends Histogram {
    constructor(opt: any) {
        super(opt)
    }
    draw(selection: any) {
        // selection are chart container
        let p = this.property;
        let grid = {
            padding: p.hitSize?.getPadding(),
            width: p.hitSize?.getWidth(),
            height: p.hitSize?.getHeight()
        }
        let data = this.adapter.parse(this.data.data);

        let svg = selection.append('svg')
            .attr('width',grid.width)
            .attr('height', grid.height)

        // 画轴
        let yAxisOpt = {...this.yAxis,...{
            max:max(data.map(datum => datum[this.yAxis.dimension])),
        }}
        let xAxisOpt = {...this.xAxis,...{
            data: data.map(datum => datum[this.xAxis.dimension]),
        }}
        
        let yAxisIns = this.scale(yAxisOpt, grid);
        let yScale = yAxisIns.getScale();

          let yAxismove = axisTransform(yAxisOpt, grid,svg)
        let xAxismove = axisTransform(xAxisOpt, grid,svg)
        svg.append('g')
            .classed(yAxisOpt.className, true)
            .attr("transform", `translate(${yAxismove[0]},${yAxismove[1]})`)
            .call(yAxisIns.getAxis());
        
        let xAxisIns = this.scale(xAxisOpt, grid);
        let xScale = xAxisIns.getScale();

        svg.append('g')
            .classed(xAxisOpt.className, true)
            .attr("transform", `translate(${xAxismove[0]},${xAxismove[1]})`)
            .call(xAxisIns.getAxis())

        // TODO update transfrom / range

        let barWidth = 16;
        const t = transition()
            .ease();
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .classed('basic-bar', true)
            .attr("fill",p.colorPool[0].HEX())
            .attr('x', (d: any) => xScale(d[xAxisOpt.dimension]) + xScale.bandwidth() / 2 - barWidth / 2)
            .attr('y', (_d: any) => (<number>grid.height) - grid.padding.pt)
            .attr('width', barWidth + "px")
            .attr('height', 0)
            .transition(t)
            .duration(4000)
            .attr('y', (d: any) => yScale(d[yAxisOpt.dimension]))
            .attr('height', (d: any) => (<number>grid.height) - grid.padding.pt - yScale(d[yAxisOpt.dimension]))
            .text((d: any) => d[0]);

    }
    scale(axisOpt: any, grid: any) {
        return new AxisBuilder(axisOpt, grid)
    }
}
export default BarChart;
