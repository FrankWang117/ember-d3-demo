import Histogram from './Histogram';
import AxisBuilder from '../scale/AxisBuilder';
import { getAxisSide } from '../scale/axisTransform';
import { Selection } from 'd3-selection';
// import {animationType} from '../animation/animation';
import { stack, stackOrderNone, stackOffsetNone } from 'd3-shape';
import { timeMonth } from 'd3-time';
import { min, max } from 'd3-array';

class StackChart extends Histogram {

    constructor(opt: any) {
        super(opt)
        // 格式化数据
        this.dataset = this.parseData(this.data.dataset)
    }
    draw(selection: Selection<any, unknown, any, any>) {
        super.draw(selection)
        // selection are chart container
        let grid = this.grid
        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)

        this.scale(svg);
        // 画 bar
        this.drawStack(svg);

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
    public parseData(data:any[]) {
        const stackIns = stack()
            .keys(Object.keys(data[0]).slice(1))
            .order(stackOrderNone)
            .offset(stackOffsetNone);

        return stackIns(data);
    }
    private drawStack(svg: Selection<any, unknown, any, any>) {
        let xScale = (<AxisBuilder>this.xAxisBuilder).getScale()
        let { property: p } = this
        let yScale = (<AxisBuilder>this.yAxisBuilder).getScale();
        let barWidth = 16;

        // const t = animationType();

        const series = this.dataset;

        svg.selectAll('g.stack')
            .data(series)
            .join(
                enter => enter.append('g'),
                update => update,
                exit => exit.remove()
            )
            .classed('stack', true)
            .attr('fill', (_d: any, i: number) => p.colorPool[i].HEX())
            .attr('transform', `translate(${barWidth/2 * -1},0)`)
            .selectAll('rect')
            .data(d => d)
            .join(
                enter => enter.append('rect'),
                update => update,
                exit => exit.remove()
            )
            .attr('x', (d: any) => {
                return xScale(new Date(d.data[this.xAxis.dimension]))})
            .attr('y', (d: any) => yScale(d[1]))
            .attr('height', (d: any) => yScale(d[0]) - yScale(d[1]))
            .attr('width', barWidth)
    }
    protected calcYaxisData() {
        const data = this.dataset;

        this.yAxis = {
            ...this.yAxis, ...{
                max: max(data, (d:any) => max(d, (di:any) => di[1])),
            }
        }
    }
    protected calcXaxisData() {
        let originData = this.data.dataset
        const timeDate = originData.map(datum => new Date(datum[this.xAxis.dimension]));

        // 为了给两端留出空白区域
        const phMinDate = timeMonth.offset(<Date>min(timeDate), -1);
        const phMaxDate = timeMonth.offset(<Date>max(timeDate), 1);
            this.xAxis = {
                ...this.xAxis, ...{
                    min: phMinDate,
                    max: phMaxDate,
                }
            }
    }
}
export default StackChart;
