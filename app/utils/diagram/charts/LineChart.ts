import Histogram from './Histogram';
import { Selection, event, clientPoint } from 'd3-selection';
import { getAxisSide } from '../scale/axisTransform';
import { flatDeep } from '../data/FlatDeep';
import { animationType, tweenDash } from '../animation/animation';
import { max } from 'd3-array';
import AxisBuilder from '../scale/AxisBuilder';
import { line, curveCatmullRom } from 'd3-shape';
import StateMachine from 'javascript-state-machine';
import D3Tooltip from '../tooltip/Tooltip';
import { formatLocale, format } from 'd3-format';

class LineChart extends Histogram {
    private fsm: any = null
    protected selection: Selection<any, unknown, any, any>

    constructor(opt: any) {
        super(opt)
        // 格式化数据 -> 修改为在 queryData 之后格式化 
        // this.dataset = this.parseData(this.data.dataset);
        let dimensions = this.dimensions,
            initFsmData = dimensions.reduce((acc: any, cur: string) => {
                acc[cur] = '';
                return acc;
            }, {}),
            transitions = dimensions.map((d: string, i: number, arr: string[]) => {
                if (i + 1 !== dimensions.length) {
                    return { name: 'drilldown', from: d, to: arr[i + 1] }
                }
                return { name: 'rollup', from: d, to: arr[0] }
            });

        this.fsm = new StateMachine({
            init: dimensions[0],
            data: initFsmData,
            transitions
        })
    }
    draw(selection: any) {
        // selection are chart container
        super.draw(selection)
        let grid = this.grid;

        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)

        // this.scale(svg);
        // this.drawLines(svg)
        this.tooltip = new D3Tooltip(selection, 'b-tooltip');

        async function flow(this: any) {
            await this.requeryData(this.updateData)
            // await this.queryData()
            this.scale(svg);
            // 画 bar
            this.drawLines(svg);
            // 添加交互
            this.mouseAction(svg);
            // 测试交互
            this.testInteraction(svg);
        }
        flow.call(this)

    }
    async requeryData(fn: Function) {
        let { fsm, dimensions } = this,
            data = null;

        data = await fn.call(this, fsm, dimensions);
        this.dataset = this.parseData(data);
    }
    testInteraction(svg: Selection<any, unknown, any, any>) {
        let self = this,
            { fsm, selection, dimensions } = this;

        svg.selectAll('circle').on('click', function (d: any) {

            // 修改 fsm 的 data-以便获取数据的时候可以得知维度信息
            if (fsm.state === dimensions[dimensions.length - 1]) {
                // 如果是最后一个维度,则进行清空
                dimensions.forEach((item: string) => {
                    fsm[item] = ''
                })
                fsm.rollup();
            } else {
                fsm.drilldown();
                dimensions.forEach((item: string) => {
                    fsm[item] = d[item] || fsm[item]
                })
            }
            // 修改坐标轴的 dimension 
            self.xAxis.dimension = fsm.state

            self.updateChart(selection);
        })
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
                .attr('stroke', () => p.colorPool[index].HEX());
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
                .attr('stroke', () => p.colorPool[index].HEX())
                .attr('fill', 'white');

            combCirle
                .append('circle')
                .classed("inner-circle", true)
                .attr('r', 1)
                .attr('stroke', () => p.colorPool[index].HEX())
                .attr('fill', () => p.colorPool[index].HEX());
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

    private mouseAction(svg: Selection<any, unknown, any, any>) {
        let { grid, property: p, dataset, tooltip } = this,
            curDimensions = [this.xAxis.dimension, this.yAxis.dimension],
            { pl, pr } = grid.padding,
            yAxisWidth = getAxisSide(svg.select(`.${this.yAxis.className}`)),
            leftBlank = pl + yAxisWidth;

        svg.on('mousemove', function () {
            let eachSpackWidth = (grid.width - leftBlank - pr) / dataset.length,
                arr = dataset.map((_item, i) => i * eachSpackWidth),
                curPoint = event.offsetX - leftBlank,
                count = arr.findIndex((item, i) => item <= curPoint && arr[i + 1] >= curPoint);

            count = count < 0 ? dataset.length - 1 : count;

            let curData = dataset[Math.round(count)];
            let p = clientPoint(this, event);
            tooltip?.updatePosition(p);
            tooltip?.setCurData(curData);
            tooltip?.setCurDimensions(curDimensions)
            tooltip?.setContent(function (data: any, dimensions: string[]) {
                console.log(data)
                console.log(dimensions)
                if (!data) {
                    return `<p>本产品 - ${data['PRODUCT_NAME']}暂无数据</p>`
                }
                return `<p>${data[dimensions[0]]} </p>
                        <!-- <p>市场规模${formatLocale("thousands").format("~s")(data['quote'])}</p> -->
                        <!-- <p>比例 ${format(".2%")(data[dimensions[1]])}</p> -->
                        <p>市场规模 ${formatLocale("thousands").format("~s")(data[dimensions[1]])}</p>`
            })
            tooltip?.show();
        })
        svg.on('mouseout', function () {
            tooltip?.hidden()
        })
    }
}
export default LineChart;
