import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';

interface D3BpBarArgs { }

const DATASET = [
    ['2018Q1', 2263262.25, 2584466.75, "0.8757", "all", null],
    ['2018Q2', 2194822.96875, 2643496, "0.8303", "all", null],
    ['2018Q3', 2359731.25, 2770609.75, "0.8517", "all", null],
    ['2018Q4', 2165844.0625, 2914783.4375, "0.7431", "all", null],
    ['201Q91', 704715.671875, 2274136, "0.3099", "all", null],
    ['201Q92', 677539.40625, 2806879, "0.2414", "all", null],
    ['201Q93', 679346.203125, 2975934, "0.2283", "all", null]
]

export default class D3BpBar extends Component<D3BpBarArgs> {
    @action
    initBar() {
        // 声明变量
        const svgContainer = select('.bp-bar');
        const width: number = Number(svgContainer.style("width").split("p")[0])
        const height: number = Number(svgContainer.style("height").split("p")[0])
        const padding = { top: 24, right: 24, bottom: 24, left: 84 }
        const barWidth = 16;
        /**
         * 添加 svg 画布
         */
        const svg = svgContainer
            .append('svg')
            .attr("width", width)
            .attr("height", height);
        /**
         * x 轴的比例尺
         */
        let xAxisData = DATASET.map((ele: any[]): string => ele[0]);
        
        const xScale = scaleBand()
            .domain(xAxisData)
            .range([0, width - padding.left])
        /**
         * y 轴的比例尺
         */
        let yAxisData = DATASET.map((ele: Array<any>): number => ele[1])
        const yScale = scaleLinear()
            .domain([0, max(yAxisData)])
            .range([height - padding.top - padding.bottom, 0]);

        /**
         * 定义坐标轴
         */
        let xAxis = axisBottom(xScale);
        let yAxis = axisLeft(yScale);

        /**
         * 添加柱状图
         */
        // svg.selectAll('rect')
        //     .data(DATASET)
        //     .enter()
        //     .append('rect')
        //     .classed('bp-bar-rect', true)
        //     .attr("transform", `translate(${padding.left},${ padding.top})`)
        //     .attr('x', (d) => {
        //         return xScale(d[0]) + xScale.bandwidth() / 2 - barWidth / 2
        //     })
        //     .attr('y', (d) => yScale(d[1]))
        //     .attr('width', barWidth + "px")
        //     .attr('height', (d) => height - padding.top - padding.bottom - yScale(d[1]))
        //     .text((d: any) => d[4]);

        /**
         * 为柱状图添加动画
         */
        const t = transition()
            .ease();

        svg.selectAll('rect')
            .data(DATASET)
            .enter()
            .append('rect')
            .classed('bp-bar-rect', true)
            .attr("fill", "#579AFF")
            .attr("transform", `translate(${padding.left},${padding.top})`)
            .attr('x', (d) => {
                return xScale(d[0]) + xScale.bandwidth() / 2 - barWidth / 2
            })
            .attr('y', (d) => height - padding.bottom - 24) // 24 为x坐标轴的高度
            .attr('width', barWidth + "px")
            .attr('height', 0)
            .transition(t)
            .duration(4000)
            .attr('y', (d) => yScale(d[1]))
            .attr('height', (d) => height - padding.top - padding.bottom - yScale(d[1]))
            .text((d: any) => d[0]);

        /**
         * 为柱状图添加交互
         */
        svg.selectAll('rect')
            .on('mouseover', function () {
                select(this).attr("fill", "#FFC400")
            })
            .on('mouseout', function () {
                select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", "#579AFF")
            })
        /***
         * 添加坐标轴
         */
        svg.append('g')
            .classed('x-axis', true)
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
            .call(xAxis);

        svg.append("g")
            .classed('y-axis', true)
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis);

    }
}
