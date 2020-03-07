import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { max } from 'd3-array';
import { line, curveCatmullRom } from 'd3-shape';
import { tweenDash, circleChange,animationType } from '../../../../utils/d3/animation';
interface D3BpLineArgs {
    data: any[]
    /**
     * 单折线数据示例
     */
    //  [
    //     ['2018Q1', 2263262.25, 2584466.75, "0.8757", "all", null],
    //     ['2018Q2', 2194822.96875, 2643496, "0.8303", "all", null],
    //     ['2018Q3', 2359731.25, 2770609.75, "0.8517", "all", null],
    //     ['2018Q4', 2165844.0625, 2914783.4375, "0.7431", "all", null],
    //     ['201Q91', 704715.671875, 2274136, "0.3099", "all", null],
    //     ['201Q92', 677539.40625, 2806879, "0.2414", "all", null],
    //     ['201Q93', 679346.203125, 2975934, "0.2283", "all", null]
    // ]
    width: number
    height: number
    layout: any // TODO用于控制 div 的布局 {h:**,w:**,x:**,y:**}
}

export default class D3BpLine extends Component<D3BpLineArgs> {
    private width: number | string = "100%"
    private height: number | string = "100%"
    // 动画函数
    // private tweenDash() {
    //     let l = this.getTotalLength(),
    //         i = interpolateString("0," + l, l + "," + l);
    //     return function (t:any) { return i(t); };
    // }

    @action
    initLine() {
        const dataset = this.args.data
        const container = select(".bp-line")
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
            .domain([0, max(dataset.map((ele: any[]) => ele[1]))])
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
        const xScale = scaleBand()
            .domain(dataset.map((ele: any[]) => ele[0]))
            .range([padding.left, this.width - padding.right - yAxisWidth])

        const xAxis = axisBottom(xScale)
        svg.append('g')
            .classed('x-axis', true)
            .attr("transform", `translate(${yAxisWidth},${this.height - padding.bottom})`)
            .call(xAxis);

        const lineLayout = line().x((d: any[]) => xScale(d[0]))
            .y((d: any) => yScale(d[1]))
            // 添加弯曲度
            // https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
            // 上述链接展示参数的不同，线条会有怎样的变化
            .curve(curveCatmullRom.alpha(0.5))
        // 单折线的数据展示方式-1
        /**
         svg.append('g')
             .append('path')
             .classed('line-path', true)
             .attr('transform', `translate(${yAxisWidth+xScale.bandwidth()/2},${padding.top})`)
             .attr('d', lineLayout(dataset))
             .attr('fill', 'none')
             .attr('stroke-width', 2)
             .attr('stroke', '#FFAB00');
        */
        // 单折线的数据展示方式-2
        svg.append("path")
            .datum(dataset)
            .classed('line-path', true)
            .attr('transform', `translate(${yAxisWidth + xScale.bandwidth() / 2},${padding.top})`)
            .attr("d", lineLayout)
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('stroke', '#FFAB00');
        // 添加初始动画
        const t = animationType();

        svg.select('.line-path')
            .transition(t)
            .duration(4000)
            .attrTween("stroke-dasharray", tweenDash);

        let circles = svg.append('g')
            .selectAll('circle')
            .data(dataset)
            .enter()

        let combCirle = circles
            .append('g')
            .classed("comb-circle", true)
            .style("width", 10)
            .attr("height",10)
            .attr('transform', function (d) {
                return 'translate(' + (xScale(d[0]) + xScale.bandwidth() / 2 + yAxisWidth) + ',' + (yScale(d[1]) + padding.top) + ')'
            });

        combCirle
            .append('circle')
            .classed("outer-circle", true)
            .attr('r', 3)
            .attr('stroke', '#FFAB00')
            .attr('fill', 'white');

        combCirle
            .append('circle')
            .classed("inner-circle", true)
            .attr('r', 1)
            .attr('stroke', '#FFAB00')
            .attr('fill', '#FFAB00');
        combCirle
            .on('mouseover', function () {
                circleChange(select(this).select('.outer-circle'), 6)
                circleChange(select(this).select('.inner-circle'), 4)
            })
            .on('mouseout', function () {
                circleChange(select(this).select('.outer-circle'), 3)
                circleChange(select(this).select('.inner-circle'), 1)
            })





    }
}
