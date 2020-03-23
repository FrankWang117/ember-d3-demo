import Histogram from './Histogram';
import { min, max } from 'd3-array';
import AxisBuilder from '../scale/AxisBuilder';
import { axisTransform } from '../scale/axisTransform'
import { transition } from 'd3-transition';
import { line, curveCatmullRom } from 'd3-shape';

class LineChart extends Histogram {
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
        let dataset:any[] = this.adapter.parse(this.data.data);

        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)

        // 画轴
        let yAxisOpt = {
            ...this.yAxis, ...{
                max: max(dataset.flat().map(datum => datum[this.yAxis.dimension])),
            }
        }
        let xAxisOpt = {
            ...this.xAxis, ...{
                data: dataset[0].map(datum => datum[this.xAxis.dimension]),
            }
        }

        let yAxisIns = this.scale(yAxisOpt, grid);
        let yScale = yAxisIns.getScale();

        let yAxismove = axisTransform(yAxisOpt, grid, svg)
        let xAxismove = axisTransform(xAxisOpt, grid, svg)
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

        const lineLayout = line().x((d: any[]) => xScale(d[xAxisOpt.dimension]))
            .y((d: any) => yScale(d[yAxisOpt.dimension]))
            // 添加弯曲度
            // https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
            // 上述链接展示参数的不同，线条会有怎样的变化
            .curve(curveCatmullRom.alpha(0.5))
        dataset.forEach((data:any,index:number)=> {
            svg.append("path")
            .datum(data)
            .classed('line-path', true)
            // .attr('transform', `translate(${yAxisWidth + xScale.bandwidth() / 2},${padding.top})`)
            .attr("d", lineLayout)
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('stroke', '#FFAB00');
        // // 添加初始动画
        // const t = animationType();

        // svg.select('.line-path')
        //     .transition(t)
        //     .duration(4000)
        //     .attrTween("stroke-dasharray", tweenDash);

        let circles = svg.append('g')
            .selectAll('circle')
            .data(data)
            .enter()

        let combCirle = circles
            .append('g')
            .classed("comb-circle", true)
            .style("width", 10)
            .attr("height", 10)
            // .attr('transform', function (d:any) {
            //     return 'translate(' + (xScale(d[0]) + xScale.bandwidth() / 2 + yAxisWidth) + ',' + (yScale(d[1]) + padding.top) + ')'
            // });

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
    scale(axisOpt: any, grid: any) {
        return new AxisBuilder(axisOpt, grid)
    }
}
export default LineChart;
