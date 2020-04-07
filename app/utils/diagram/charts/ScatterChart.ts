import Histogram from './Histogram';
import AxisBuilder from '../scale/AxisBuilder';
import { getAxisSide } from '../scale/axisTransform';
import { Selection, select, event } from 'd3-selection';
import { animationType } from '../animation/animation';
import { min, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';

class ScatterChart extends Histogram {

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
        // 画
        this.drawScatter(svg);
        // action
        
        // this.mouseAction(svg);

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
    private drawScatter(svg: Selection<any, unknown, any, any>) {
        let xScale = (<AxisBuilder>this.xAxisBuilder).getScale()
        let { grid, xAxis, yAxis, property: p, polar } = this

        let yScale = (<AxisBuilder>this.yAxisBuilder).getScale();

        // const tooltipIns = new D3Tooltip(container, 'scatter-tooltip')

        const data = this.dataset;

        // 数据大小比例尺
        let dataMaxValue = this.getAxisMaxValue(data, this.polar.dimension)
        const dataScale = scaleLinear()
            .domain([0, dataMaxValue])
            .range([0, 20])

        const t = animationType()
        // scatter
        const circle = svg.selectAll('circle')
            .data(data)
            .join(
                enter => enter.append('circle'),
                update => update,
                exit => exit.remove()
            ).attr('cx', (d: any) => xScale(d[xAxis.dimension]))
            .attr('cy', (d: any) => yScale(d[yAxis.dimension]))

        circle.transition(t)
            .duration(1600)
            .attr('r', (d: any) => dataScale(d[polar.dimension]))
            .attr('fill', (_d: any, i: number) => schemeSet3[i])
            .style('opacity', 0.6)

        circle.on('mouseover', function (d: any) {
            select(this)
                .transition(t)
                .duration(1600)
                .attr('r', () => dataScale(d[polar.dimension]) * 1.4);

            // tooltipIns.setCurData(d);
            // tooltipIns.getTooltip()
            //     .classed("d-none", false);
            // tooltipIns.setContent(function (data: any) {
            //     console.log("data")
            //     if (!data) {
            //         return `<p>暂无数据</p>`
            //     }
            //     return `<p>${ data[0]}</p>
            //             <p>产品销量${formatLocale("thousands").format("~s")(data[3])}</p>
            //             <p>产品销量增长率 ${format(".2%")(data[2])}</p>
            //             <p>市场增长率 ${format(".2%")(data[1])}</p>`
            // })
        }).on('mouseout', function (d: any) {
            select(this)
                .transition(t)
                .duration(1200)
                .attr('r', () => dataScale(d[polar.dimension]));
            // container.select('.scatter-tooltip')
            //     .classed("d-none", true)
            // selectAll('p').remove()
        })

    }
    private getAxisMaxValue(data: any, property: number | string) {
        const yAxisData: number[] = data.map((datum: any) => datum[property])
        return Math.max(
            Math.abs((<number>min(yAxisData))),
            Math.abs((<number>max(yAxisData)))
        );
    }
    protected calcYaxisData() {
        const data = this.dataset;
        const yMaxValue = this.getAxisMaxValue(data, this.yAxis.dimension)

        // const yAxis = axisLeft(yScale)
        // .tickFormat(format(".2%")); // format([.precision][type])

        this.yAxis = {
            ...this.yAxis, ...{
                min: -1 * yMaxValue,
                max: yMaxValue,
            }
        }
    }

    protected calcXaxisData() {
        const data = this.dataset;
        const xMaxValue = this.getAxisMaxValue(data, this.xAxis.dimension);

        this.xAxis = {
            ...this.xAxis, ...{
                min: -1 * xMaxValue,
                max: xMaxValue,
            }
        }
    }
    private mouseAction(svg: Selection<any, unknown, any, any>) {
        alert('mouse')
        let { grid, property: p, dataset } = this,
            { pl, pr } = grid.padding,
            yAxisWidth = getAxisSide(svg.select(`.${this.yAxis.className}`)),
            leftBlank = pl + yAxisWidth;

            let eachBandWidth = (this.xAxisBuilder as AxisBuilder).getScale().bandwidth()
        
        svg.on('mouseover', function () {
            console.log("bandWidh" + eachBandWidth)
            console.log(event.offsetX);
            
            let arr = dataset.map((_item, i) => {
                return i * eachBandWidth
            })
            console.log(arr)
            let curPoint = event.offsetX - leftBlank;
            console.log(curPoint)
            let count = arr.findIndex((item, i) => {
                return item <= curPoint && arr[i+1] >= curPoint;
            })
            console.log(count)
                // (event.offsetX - leftBlank) / (grid.width - leftBlank - pr) * (dataset.length - 1)
            // count = Math.round(count) >= dataset.length ? dataset.length - 1 : count // 判断一下count是否为>=data.length的值,确立一下边界值
            console.log(count)
            let curData = dataset[Math.round(count)];
            console.log(curData)
        })
        // svg.selectAll('rect')
        //     .on('mouseover', function () {
        //         select(this).attr("fill", "#FFC400")
        //     })
        //     .on('mouseout', function () {
        //         select(this)
        //             .transition()
        //             .duration(1000)
        //             .attr("fill", p.colorPool[0].HEX())
        //     })
    }
}
export default ScatterChart;
