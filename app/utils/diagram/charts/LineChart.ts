import Histogram from './Histogram';
import { Selection } from 'd3-selection';
import { getAxisSide } from '../scale/axisTransform';
import { flatDeep } from '../data/FlatDeep';
import { animationType, tweenDash } from '../animation/animation';

import { min, max } from 'd3-array';
import AxisBuilder from '../scale/AxisBuilder';
import { axisTransform } from '../scale/axisTransform'
import { transition } from 'd3-transition';
import { line, curveCatmullRom } from 'd3-shape';

class LineChart extends Histogram {
    constructor(opt: any) {
        super(opt)
        this.dataset = this.parseData(this.data.dataset)
    }
    draw(selection: any) {
        // selection are chart container
        let p = this.property;
        let grid = this.grid;

        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)

        this.scale(svg);
        this.drawLines(svg)
        // 画轴
        // let yAxis = {
        //     ...this.yAxis, ...{
        //         max: max(dataset.flat().map(datum => datum[this.yAxis.dimension])),
        //     }
        // }
        // let xAxis = {
        //     ...this.xAxis, ...{
        //         data: dataset[0].map(datum => datum[this.xAxis.dimension]),
        //     }
        // }

        // let yAxisIns = this.scale(yAxis, grid);
        // let yScale = yAxisIns.getScale();

        // let yAxismove = axisTransform(yAxis, grid, svg)
        // let xAxismove = axisTransform(xAxis, grid, svg)
        // svg.append('g')
        //     .classed(yAxis.className, true)
        //     .attr("transform", `translate(${yAxismove[0]},${yAxismove[1]})`)
        //     .call(yAxisIns.getAxis());

        // let xAxisIns = this.scale(xAxis, grid);
        // let xScale = xAxisIns.getScale();

        // svg.append('g')
        //     .classed(xAxis.className, true)
        //     .attr("transform", `translate(${xAxismove[0]},${xAxismove[1]})`)
        //     .call(xAxisIns.getAxis())

        // // TODO update transfrom / range

        // const lineLayout = line().x((d: any[]) => xScale(d[xAxis.dimension]))
        //     .y((d: any) => yScale(d[yAxis.dimension]))
        //     // 添加弯曲度
        //     // https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
        //     // 上述链接展示参数的不同，线条会有怎样的变化
        //     .curve(curveCatmullRom.alpha(0.5))
        // dataset.forEach((data:any,index:number)=> {
        //     svg.append("path")
        //     .datum(data)
        //     .classed('line-path', true)
        //     // .attr('transform', `translate(${yAxisWidth + xScale.bandwidth() / 2},${padding.top})`)
        //     .attr("d", lineLayout)
        //     .attr('fill', 'none')
        //     .attr('stroke-width', 2)
        //     .attr('stroke', '#FFAB00');
        // // // 添加初始动画
        // // const t = animationType();

        // // svg.select('.line-path')
        // //     .transition(t)
        // //     .duration(4000)
        // //     .attrTween("stroke-dasharray", tweenDash);

        // let circles = svg.append('g')
        //     .selectAll('circle')
        //     .data(data)
        //     .enter()

        // let combCirle = circles
        //     .append('g')
        //     .classed("comb-circle", true)
        //     .style("width", 10)
        //     .attr("height", 10)
        //     // .attr('transform', function (d:any) {
        //     //     return 'translate(' + (xScale(d[0]) + xScale.bandwidth() / 2 + yAxisWidth) + ',' + (yScale(d[1]) + padding.top) + ')'
        //     // });

        // combCirle
        //     .append('circle')
        //     .classed("outer-circle", true)
        //     .attr('r', 3)
        //     .attr('stroke', '#FFAB00')
        //     .attr('fill', 'white');

        // combCirle
        //     .append('circle')
        //     .classed("inner-circle", true)
        //     .attr('r', 1)
        //     .attr('stroke', '#FFAB00')
        //     .attr('fill', '#FFAB00');
        // // combCirle
        // //     .on('mouseover', function (d: any) {
        // //         circleChange(select(this).select('.outer-circle'), 6)
        // //         circleChange(select(this).select('.inner-circle'), 4);
        // //         tooltipIns.setCurData(d);
        // //         tooltipIns.show();
        // //         tooltipIns.setContent(function (data: any) {
        // //             if (!data) {
        // //                 return `<p>本市场暂无数据</p>`
        // //             }
        // //             return `
        // //             <p>时间${ data[0]}</p>
        // //             <p>数据${formatLocale("thousands").format("~s")(data[1])}</p>
        // //             <p>其他数据${format(".2%")(data[3])}</p>`
        // //         })
        // //     })
        // //     .on('mouseout', function () {
        // //         circleChange(select(this).select('.outer-circle'), 3)
        // //         circleChange(select(this).select('.inner-circle'), 1)
        // //         tooltipIns.hidden()

        // //     })
        // })


    }
    scale(svg: Selection<any, unknown, any, any>) {
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
    private drawLines(svg: Selection<any, unknown, any, any>) {
        let xScale = (<AxisBuilder>this.xAxisBuilder).getScale()
        let { grid, xAxis, yAxis, property: p } = this
        let yScale = (<AxisBuilder>this.yAxisBuilder).getScale();

        const lineLayout = line().x((d: any[]) => xScale(d[xAxis.dimension]))
            .y((d: any) => yScale(d[yAxis.dimension]))
            // 添加弯曲度
            // https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
            // 上述链接展示参数的不同，线条会有怎样的变化
            .curve(curveCatmullRom.alpha(0.5))

        this.dataset.forEach((data: any, index: number) => {
            svg.append("path")
                .datum(data)
                .classed('line-path', true)
                .attr('transform', `translate(${xScale.bandwidth() / 2},0)`)
                .attr("d", lineLayout)
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr('stroke', '#FFAB00');
            // 添加初始动画
            const t = animationType();

            svg.select('.line-path')
                .transition(t)
                .duration(1600)
                .attrTween("stroke-dasharray", tweenDash);

            let circles = svg.append('g')
                .selectAll('circle')
                .data(data)
                .enter()

            let combCirle = circles
                .append('g')
                .classed("comb-circle", true)
                .style("width", 10)
                .attr("height", 10)
                .attr("transform", (d: any) => `translate(${xScale(d[xAxis.dimension]) + xScale.bandwidth() / 2},${yScale(d[yAxis.dimension])})`)

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
            // combCirle
            //     .on('mouseover', function (d: any) {
            //         circleChange(select(this).select('.outer-circle'), 6)
            //         circleChange(select(this).select('.inner-circle'), 4);
            //         tooltipIns.setCurData(d);
            //         tooltipIns.show();
            //         tooltipIns.setContent(function (data: any) {
            //             if (!data) {
            //                 return `<p>本市场暂无数据</p>`
            //             }
            //             return `
            //             <p>时间${ data[0]}</p>
            //             <p>数据${formatLocale("thousands").format("~s")(data[1])}</p>
            //             <p>其他数据${format(".2%")(data[3])}</p>`
            //         })
            //     })
            //     .on('mouseout', function () {
            //         circleChange(select(this).select('.outer-circle'), 3)
            //         circleChange(select(this).select('.inner-circle'), 1)
            //         tooltipIns.hidden()

            //     })
        })
    }
    // 这个需要根据 x 轴 / y 轴展示的数据进行修改
    protected calcXaxisData() {
        // default xAxis type category
        this.xAxis = {
            ...this.xAxis, ...{
                data: this.dataset[0].map((datum: any) => datum[this.xAxis.dimension]),
            }
        }
    }
    protected calcYaxisData() {
        const flatData = flatDeep(this.dataset);

        this.yAxis = {
            ...this.yAxis, ...{
                max: max(flatData.map(datum => datum[this.yAxis.dimension])),
            }
        }
    }
}
export default LineChart;
