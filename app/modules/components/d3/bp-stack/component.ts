import Component from '@glimmer/component';
import { action } from '@ember/object';
import Layout from 'ember-d3-demo/utils/d3/layout';
import { scaleTime, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { min, max } from 'd3-array';
import { timeMonth } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { stack, stackOrderNone, stackOffsetNone } from 'd3-shape';
import { getAxisSide } from 'ember-d3-demo/utils/d3/axisWidth';
import { schemePaired } from 'd3-scale-chromatic';
import AxisBuilder from 'ember-d3-demo/utils/d3/axis';

interface D3BpStackArgs {
    /** 数据格式
    * [
        {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
        {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
        {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
        {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400}
    ]
    */
    data: any[];
    // grid opt
    // TODO 与其他的 opt 合并
    grid: any;

}

export default class D3BpStack extends Component<D3BpStackArgs> {
    constainer: any = null
    width: number = 0;
    height: number = 0;
    @action
    initChart() {
        const data = this.args.data;
        // test grid
        let grid = {
            width: "100%",
            backgroundColor: "#fafbfc"
        }
        let layout = new Layout('.bp-stack',grid)

        const container = layout.getContainer()
        this.width = layout.getWidth()
        this.height = layout.getHeight()
        this.constainer = container
        const padding = layout.getPadding()

        // 生成 svg
        let svg = layout.getSvg();

        // 获取 stack 处理数据
        const stackIns = stack()
            .keys(Object.keys(data[0]).slice(1))
            .order(stackOrderNone)
            .offset(stackOffsetNone);

        const series = stackIns(data);

        // end 获取 stack 处理数据

        const timeDate = data.map(datum => datum.month);

        let maxYValue = max(series, d => max(d, d => d[1]))
        let axisOpt = {
            className: "y-axis",
            position: 'left',
            max: maxYValue
        }
        let axisBuilder = new AxisBuilder(layout,axisOpt);
        // axisBuilder.createAxis()
        // y 轴 scale
        // const yScale = scaleLinear()
        //     .domain([0, max(series, d => max(d, d => d[1]))])
        //     .range([this.height - padding.pt - padding.pb, 0]);

        // const yAxis = axisBuilder.getYAxis()
        const yScale = axisBuilder.getScale()
        // svg.append('g')
        //     .classed("y-axis", true)
        //     .call(yAxis);

        // y轴宽度
        // const yAxisWidth: number = getYAxisWidth(svg.select('.y-axis'));
        const yAxisWidth: number = getAxisSide(svg.select('.y-axis'))

        // svg.select(".y-axis")
        //     .attr("transform", `translate(${padding.pl + yAxisWidth},${padding.pt})`);

        // 为了给两端留出空白区域
        const phMinDate = timeMonth.offset(min(timeDate), -1);
        const phMaxDate = timeMonth.offset(max(timeDate), 1);

        // x轴scale
        const xScale = scaleTime()
            .domain([phMinDate, phMaxDate])
            .range([padding.pl, this.width - padding.pr - yAxisWidth]);

        // x轴
        const xAxis = axisBottom(xScale)
            .ticks(timeMonth.every(1))
            .tickFormat(timeFormat('%y-%m'))

        svg.append('g')
            .classed("x-axis", true)
            .attr("transform", `translate(${yAxisWidth},${this.height - padding.pb})`)
            .call(xAxis)

        svg.selectAll('g.stack')
            .data(series)
            .join(
                enter => enter.append('g'),
                update => update,
                exit => exit.remove()
            )
            .classed('stack', true)
            .attr('fill', (d: any, i: number) => schemePaired[i])
            .attr('transform', `translate(${yAxisWidth},0)`)
            .selectAll('rect')
            .data(d => d)
            .join(
                enter => enter.append('rect'),
                update => update,
                exit => exit.remove()
            )
            .attr('x', (d: any) => xScale(d.data.month))
            .attr('y', (d: any) => yScale(d[1]))
            .attr('height', (d: any) => yScale(d[0]) - yScale(d[1]))
            .attr('width', 14)

    }
}
