import Histogram from './Histogram';
import AxisBuilder from '../scale/AxisBuilder';
import { getAxisSide } from '../scale/axisTransform';
import { Selection, select, event,clientPoint } from 'd3-selection';
import { animationType } from '../animation/animation';
import { min, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';
import StateMachine from 'javascript-state-machine';
import { formatLocale, format } from 'd3-format';
import D3Tooltip from '../tooltip/Tooltip';

class ScatterChart extends Histogram {
    private fsm: any = null
    private selection: Selection<any, unknown, any, any>

    constructor(opt: any) {
        super(opt)
        // 格式化数据 -> 修改为在 queryData 之后格式化 
        // this.dataset = this.parseData(this.data.dataset);
        let dimensions = this.dimensions,
            initFsmData = dimensions.reduce((acc: any, cur: string) => {
                acc[cur] = '';
                return acc
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
    draw(selection: Selection<any, unknown, any, any>) {
        super.draw(selection)
        // selection are chart container
        // 将 svg 容器放到全局,供 update 使用
        this.selection = selection;
        let grid = this.grid,
            svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)

        this.tooltip = new D3Tooltip(selection, 'b-tooltip');

        // this.scale(svg);
        // 画
        // this.drawScatter(svg);
        // action
        
        // this.mouseAction(svg);
        async function flow(this: any) {
            await this.requeryData(this.updateData);
            // 无坐标轴(dimension 信息保存在 geo 中);
            this.scale(svg);
            // 画 map
            await this.drawScatter(svg);
            // 添加交互
            this.mouseAction(svg);
            // 测试交互
            this.testInteraction(svg);
        }
        flow.call(this);

    }
    async requeryData(fn: Function) {
        let { fsm, dimensions } = this,
            data = null;

        data = await fn.call(this, fsm, dimensions);
        this.dataset = this.parseData(data);
    }
    testInteraction(svg: Selection<any, unknown, any, any>) {
        let { fsm, selection, dimensions, dataset } = this;
        let self = this;

        svg.selectAll('circle').on('click', function (d: any) {
            
            let curData: any = d;

            if (fsm.state === dimensions[dimensions.length - 1] || !curData) {
                // TODO 当当前省份无数据时,进行 rollup 就出现错误,但是可以忽略
                // 如果是最后一个维度,则进行清空
                dimensions.forEach((item: string) => {
                    fsm[item] = ''
                })
                fsm.rollup();
                self.updateChart(selection);

            } else {
                fsm.drilldown();
                dimensions.forEach((item: string) => {
                    fsm[item] = curData[item] || fsm[item]
                })
                self.updateChart(selection);

            }
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
    private drawScatter(svg: Selection<any, unknown, any, any>) {

        let { grid, xAxis, yAxis, property: p, polar,dataset:data } = this,
            xScale = (this.xAxisBuilder as AxisBuilder).getScale(),
            yScale = (this.yAxisBuilder as AxisBuilder).getScale(),
            // 数据大小比例尺
            dataMaxValue = this.getAxisMaxValue(data, this.polar.dimension);

        const dataScale = scaleLinear()
            .domain([0, dataMaxValue])
            .range([3, 20])

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
            .attr('r', (d: any) => dataScale(d[polar.dimension]) ? dataScale(d[polar.dimension]) : 5)
            .attr('fill', (_d: any, i: number) => schemeSet3[i])
            .style('opacity', 0.6)

        circle.on('mouseover', function (d: any) {
            select(this)
                .transition(t)
                .duration(1600)
                .attr('r', () => dataScale(d[polar.dimension])?dataScale(d[polar.dimension]) * 1.4: 7);

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
     
        let { grid, property: p, dataset,tooltip,fsm } = this,
            curDimensions = [fsm.state];
        
        svg.selectAll("circle").on('mouseover', function (d:any) {
            // animation 
            // select(this)
            //     .transition(t)
            //     .duration(1600)
            //     .attr('r', () => dataScale(d[polar.dimension])?dataScale(d[polar.dimension]) * 1.4: 7);

            const curSelect = select(this);
            curSelect.classed('path-active', true);
            
            let p = clientPoint(this, event);
            console.log(p)
            tooltip?.updatePosition(p);
            tooltip?.setCurData(d);
            tooltip?.setCurDimensions(curDimensions)
            tooltip?.setContent(function (data: any, dimensions: string[]) {
                if (!data) {
                    return `<p>本市场暂无数据</p>`
                }
                return `
                        <p>${ data[dimensions[0]]} 市场概况</p>
                        <p>市场规模${formatLocale("thousands").format("~s")(data['SALES_QTY'])}</p>
                        <p>销售额 ${formatLocale("thousands").format("~s")(data['SALES_VALUE'])}</p>
                        <!-- <p>sales ${format(".2%")(data['sales'])}</p> -->`
            })
            tooltip?.show();
        })
        svg.selectAll("circle").on('mouseout', function () {
            select(this)
                .classed('path-active', false);
            tooltip?.hidden();
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
