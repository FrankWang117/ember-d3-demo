import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';
import { scaleBand, scaleTime, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { max, min } from 'd3-array';
import { line, curveCatmullRom } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { transition } from 'd3-transition';
// import { timeMonth } from 'd3-time';
// import { timeFormat } from 'd3-time-format'
import { tweenDash ,animationType} from '../../../../utils/d3/animation';

interface D3BpMultiLinesArgs {
    data: any[]
    /**
     * 多折线数据示例
     */
    // [[
    //     {label:'2018-01', name:"开浦兰",value:0.715,count: 2300, other:0.0000},
    //     {label:'2018-04', name:"开浦兰",value:0.663,count: 2400, other:0.0000},
    //     {label:'2018-07', name:"开浦兰",value:0.18,count: 2300, other:0.0000},
    //     {label:'2018-10', name:"开浦兰",value:0.3788,count: 2300, other:0.0000}
    // ],
    // [
    //     {label:'2018-01', name:"癫痫竞品1",value:0.15,count: 2100, other:0.0000},
    //     {label:'2018-04', name:"癫痫竞品1",value:0.63,count: 2400, other:0.0000},
    //     {label:'2018-07', name:"癫痫竞品1",value:0.18,count: 200, other:0.0000},
    //     {label:'2018-10', name:"癫痫竞品1",value:0.78,count: 300, other:0.0000}
    // ],
    // [
    //     {label:'2018-01', name:"维派特",value:0.5,count: 100, other:0.0000},
    //     {label:'2018-04', name:"维派特",value:0.3,count: 400, other:0.0000},
    //     {label:'2018-07', name:"维派特",value:0.1,count: 2500, other:0.0000},
    //     {label:'2018-10', name:"维派特",value:0.7,count: 3100, other:0.0000}
    // ]]
    width: number
    height: number
    layout: any // TODO用于控制 div 的布局 {h:**,w:**,x:**,y:**}
}
interface D3BpMultiLinesArgs { }

export default class D3BpMultiLines extends Component<D3BpMultiLinesArgs> {
    private width: number | string = "100%"
    private height: number | string = "100%"
    // 动画函数
    // private tweenDash() {
    //     let l = this.getTotalLength(),
    //         i = interpolateString("0," + l, l + "," + l);
    //     return function (t: any) { return i(t); };
    // }
    @action
    initLine() {
        const dataset = this.args.data
        const container = select(".bp-multiline");
        
        this.width = parseInt(container.style("width"))
        this.height = parseInt(container.style("height"))
        const padding = {
            top: 24,
            right: 24,
            bottom: 24,
            left: 24
        }
        const svg = container.append('svg')
            .attr("width", this.width)
            .attr('height', this.height)
            .style('background-color', "#fafbfc");

        const yScale = scaleLinear()
            .domain([0, max(dataset.flat().map((ele: any[]) => ele['value']))])
            .range([this.height - padding.top - padding.bottom, 0]);

        const yAxis = axisLeft(yScale)

        svg.append('g')
            .classed('y-axis', true)
            .call(yAxis)

        // 动态获取y坐标轴的宽度
        const yAxisWidth: number = svg.select('.y-axis').node().getBBox().width;

        svg.select(".y-axis")
            .attr("transform", `translate(${padding.left + yAxisWidth},${padding.top})`)

        // 最后绘制 x 坐标轴，可以根据y轴的宽度动态计算 x轴所占的宽度
        /**
         * 为了 scaleTime
            let xLabel = dataset[0].map((ele: any) => ele['label'])
            let minXvalue = new Date(min(xLabel))
            let maxXvalue = new Date(max(xLabel))
         */

        const xScale = scaleBand()
            .domain(dataset[0].map((ele: any[]) => ele['label']))
            // 为了 scaleTime
            // .domain([minXvalue, maxXvalue])
            .range([padding.left, this.width - padding.right - yAxisWidth]);

        const xAxis = axisBottom(xScale)
        // 为了 scaleTime
        // .ticks(timeMonth.every(3))
        // .tickFormat(timeFormat("%YQ%q"))

        svg.append('g')
            .classed('x-axis', true)
            .attr("transform", `translate(${yAxisWidth},${this.height - padding.bottom})`)
            .call(xAxis);

        const lineLayout = line().x((d: any[]) => xScale(d['label']))
            .y((d: any) => yScale(d['value']))
            .curve(curveCatmullRom.alpha(0.5))

        // 多折线的数据展示方式-1
        dataset.forEach((data: any, index: number) => {
            svg.append("path")
                .datum(data)
                .classed('line-path', true)
                .attr('transform', `translate(${yAxisWidth + xScale.bandwidth() / 2},${padding.top})`)
                .attr("d", lineLayout)
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr('stroke', () => schemeCategory10[index]);

            let circles = svg.append('g')
                .selectAll('circle')
                .data(data)
                .enter()

            circles.append('circle')
                .attr('r', 3)
                .attr('transform', (d: any) => `translate( ${xScale(d['label']) + yAxisWidth + xScale.bandwidth() / 2},${yScale(d['value']) + padding.top})`)
                .attr('stroke', schemeCategory10[index])
                .attr('fill', 'white')
                .on('mouseover', function () {
                    select(this)
                        .transition()
                        .duration(600)
                        .attr('r', 6)
                })
                .on('mouseout', function () {
                    select(this)
                        .transition()
                        .duration(600)
                        .attr('r', 3)
                })
        })
        // TODO 其他展现形式
        // svg.selectAll('path')
        //     .data(dataset)
        //     .enter()
        //     .append('path')
        //     .classed('.line-path', true)
        //     .attr('d',  (d:any)=>lineLayout(d))
        //     .attr('transform', `translate(${padding.left + yAxisWidth},${padding.top})`)
        //     .style('stroke', d => 'red')
        //     .style('stroke-width', 2)
        //     .style('fill', 'transparent')// 单折线的数据展示方式-1
        /**
         svg.append('g')
             .append('path')
             .classed('line-path', true)
             .attr('transform', `translate(${padding.left + yAxisWidth},${padding.top})`)
             .attr('d', lineLayout(dataset))
             .attr('fill', 'none')
             .attr('stroke-width', 2)
             .attr('stroke', '#FFAB00');
        */
        // 添加初始动画
        const t = animationType()

        svg.selectAll('.line-path')
            .transition(t)
            .duration(4000)
            .attrTween("stroke-dasharray", tweenDash);

    }
}
