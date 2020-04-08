import Histogram from './Histogram';
import AxisBuilder from '../scale/AxisBuilder';
import { getAxisSide } from '../scale/axisTransform';
import { Selection, event, clientPoint } from 'd3-selection';
import { animationType } from '../animation/animation';
import D3Tooltip from '../tooltip/Tooltip';
import { formatLocale, format } from 'd3-format';
import StateMachine from 'javascript-state-machine';
// import fetch from 'fetch';

class BarChart extends Histogram {
    private tooltip: D3Tooltip | undefined 
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
        super.draw(selection);
        // 将 svg 容器放到全局,供 update 使用
        this.selection = selection;
        // selection are chart container
        let grid = this.grid,
            svg = selection.append('svg')
                .attr('width', grid.width)
                .attr('height', grid.height);

        this.tooltip = new D3Tooltip(selection, 'b-tooltip');

        async function flow(this: any) {
            await this.requeryData(this.updateData)
            // await this.queryData()
            this.scale(svg);
            // 画 bar
            this.drawBar(svg);
            // 添加交互
            this.mouseAction(svg);
            // 测试交互
            this.testInteraction(svg);
        }
        flow.call(this)

    }
    // updateChart(selection: Selection<any, unknown, any, any>) {
    //     selection.select('svg').remove();
    //     this.tooltip?.remove();
    //     this.draw(selection)
    // }
    testInteraction(svg: Selection<any, unknown, any, any>) {
        let self = this,
            { fsm, selection, dimensions } = this;

        svg.selectAll('rect').on('click', function (d: any) {

            // 修改 fsm 的 data-以便获取数据的时候可以得知维度信息
            if (fsm.state === dimensions[dimensions.length-1]) {
                // 如果是最后一个维度,则进行清空
                dimensions.forEach((item:string)=> {
                    fsm[item] = ''
                })
                fsm.rollup();
            } else {
                fsm.drilldown();
                dimensions.forEach((item:string)=> {
                    fsm[item] = d[item] || fsm[item]
                })
            }
            // 修改坐标轴的 dimension 
            self.xAxis.dimension = fsm.state

            self.updateChart(selection);
        })
    }
    async requeryData(fn: Function) {
        let {fsm,dimensions} = this,
            data = null;

        data = await fn.call(this, fsm, dimensions);
        this.dataset = this.parseData(data);
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
    private drawBar(svg: Selection<any, unknown, any, any>) {
        let xScale = (this.xAxisBuilder as AxisBuilder).getScale()
        let { grid, xAxis, yAxis, property: p } = this
        let yScale = (this.yAxisBuilder as AxisBuilder).getScale();
        let barWidth = 16;
        const t = animationType();
        svg.selectAll('rect')
            .data(this.dataset)
            .enter()
            .append('rect')
            .classed('basic-bar', true)
            .attr("fill", p.colorPool[0].HEX())
            .attr('x', (d: any) => xScale(d[xAxis.dimension]) + xScale.bandwidth() / 2 - barWidth / 2)
            .attr('y', (_d: any) => (grid.height as number) - grid.padding.pb - yAxis.offset - yAxis.edgeWidth)
            .attr('width', barWidth + "px")
            .attr('height', 0)
            .transition(t)
            .duration(1400)
            .attr('y', (d: any) => yScale(d[yAxis.dimension]))
            .attr('height', (d: any) => (<number>grid.height) - grid.padding.pt - yAxis.offset - yAxis.edgeWidth - yScale(d[yAxis.dimension]))

    }
    private mouseAction(svg: Selection<any, unknown, any, any>) {
        let { grid, property: p, dataset, tooltip } = this,
            curDimensions = [this.xAxis.dimension,this.yAxis.dimension],
            { pl, pr } = grid.padding,
            yAxisWidth = getAxisSide(svg.select(`.${this.yAxis.className}`)),
            leftBlank = pl + yAxisWidth;
        // let eachBandWidth = (this.xAxisBuilder as AxisBuilder).getScale().bandwidth()
        //         svg.on('mousemove', tooltip?.throttle(function (event) {
        //             let eachSpackWidth = (grid.width - leftBlank - pr) / dataset.length,
        //                 arr = dataset.map((_item, i) => i * eachSpackWidth),
        //                 curPoint = event.offsetX - leftBlank,
        //                 count = arr.findIndex((item, i) => item <= curPoint && arr[i + 1] >= curPoint);
        // t
        //             count = count < 0 ? dataset.length - 1 : count;

        //             let curData = dataset[Math.round(count)];
        //             console.log(curData)
        //             tooltip?.setCurData(curData);
        //             tooltip?.show();
        //             tooltip?.setContent(function (data: any) {
        //                 console.log(data)
        //                 if (!data) {
        //                     return `<p>本市场暂无数据</p>`
        //                 }
        //                 return `
        //                         <p>${ data['phase']} 市场概况</p>
        //                         <p>市场规模${formatLocale("thousands").format("~s")(data['quote'])}</p>
        //                         <p>sales ${format(".2%")(data['sales'])}</p>`
        //             })
        //         }, 50, 100))
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
            tooltip?.setContent(function (data: any,dimensions:string[]) {
                if (!data) {
                    return `<p>本产品 - ${data['PRODUCT_NAME']}暂无数据</p>`
                }
                return `<p>${ data[dimensions[0]]} </p>
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
export default BarChart;
