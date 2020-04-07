import Histogram from './Histogram';
import AxisBuilder from '../scale/AxisBuilder';
import { getAxisSide } from '../scale/axisTransform';
import { Selection, select, event, clientPoint } from 'd3-selection';
import { animationType } from '../animation/animation';
import D3Tooltip from '../tooltip/Tooltip';
import { formatLocale, format } from 'd3-format';
import StateMachine from 'javascript-state-machine';
import { Promise } from 'rsvp';

class BarChart extends Histogram {
    private tooltip: D3Tooltip | undefined
    private fsm: any = null
    private selection: Selection<any, unknown, any, any>
    constructor(opt: any) {
        super(opt)
        // 格式化数据 -> 修改为在 queryData 之后格式化 
        // this.dataset = this.parseData(this.data.dataset);
        // this.fsm = new StateMachine({
        //     init: 'season',
        //     transitions: [
        //         { name: 'downMonth', from: 'season', to: 'month' },
        //         { name: 'upYear', from: 'month', to: 'year' },
        //         { name: 'downSeason', from: 'year', to: 'season' }
        //     ],
        //     methods: {
        //         onDownMonth: function () { console.log('season drill down to month') },
        //         onUpYear: function () { console.log('month scroll up to year') },
        //         onDownSeason: function () { console.log('year drill down to season') },
        //         onCondense: function () { console.log('I condensed') }
        //     }
        // });
        this.fsm = new StateMachine({
            init: 'season',
            transitions: [
                { name: 'drilldown', from: 'year', to: 'season' },
                { name: 'drilldown', from: 'season', to: 'month' },
                { name: 'scrollup', from: 'month', to: 'year' }
            ]
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
            await this.queryData()
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
    updateChart(selection: Selection<any, unknown, any, any>) {
        selection.select('svg').remove();
        this.tooltip?.remove();
        this.draw(selection)
    }
    testInteraction(svg: Selection<any, unknown, any, any>) {
        let fsm = this.fsm;
        let self = this,
            selection = this.selection;

        svg.selectAll('rect').on('click', function () {
            if (fsm.state === 'month') {
                fsm.scrollup()
            } else {
                fsm.drilldown()
            }
            self.updateChart(selection);
        })
    }
    queryData() {
        let fsm = this.fsm,
            dimension = fsm.state,
            data = null;
            
        return new Promise((resolve, reject) => {
            resolve('query data')
        }).then(res => {
            console.log(res);
            if (dimension === 'season') {
                data = [
                    {
                        phase: '2018Q1',
                        sales: 2200000.25,
                        quote: 2584466.75,
                        rate: "0.8757",
                        product: "all"
                    },
                    {
                        phase: '2018Q2',
                        sales: 2194822.96875,
                        quote: 2643496,
                        rate: "0.8303",
                        product: "all"
                    },
                    {
                        phase: '2018Q3',
                        sales: 2359731.25,
                        quote: 2770609.75,
                        rate: "0.8517",
                        product: "all"
                    },
                    {
                        phase: '2018Q4',
                        sales: 2165844.0625,
                        quote: 2914783.4375,
                        rate: "0.7431",
                        product: "all"
                    },
                    {
                        phase: '2019Q1',
                        sales: 704715.671875,
                        quote: 2274136,
                        rate: "0.3099",
                        product: "all"
                    },
                    {
                        phase: '2019Q2',
                        sales: 677539.40625,
                        quote: 2806879,
                        rate: "0.2414",
                        product: "all"
                    },
                    {
                        phase: '2019Q3',
                        sales: 679346.203125,
                        quote: 2975934,
                        rate: "0.2283",
                        product: "all"
                    }
                ]
            } else if (dimension === 'year') {
                data = [
                    {
                        phase: '2018',
                        sales: 12200000.25,
                        quote: 12584466.75,
                        rate: "0.8757",
                        product: "all"
                    },
                    {
                        phase: '2019',
                        sales: 21194822.65,
                        quote: 2643496,
                        rate: "0.8303",
                        product: "all"
                    },
                    {
                        phase: '2020',
                        sales: 22359731.25,
                        quote: 22770609.75,
                        rate: "0.8517",
                        product: "all"
                    },
                    {
                        phase: '2021',
                        sales: 22165844.15,
                        quote: 22914783.45,
                        rate: "0.7431",
                        product: "all"
                    }
                ]
            } else {
                data = [
                    {
                        phase: '2018M1',
                        sales: 2200000.25,
                        quote: 2584466.75,
                        rate: "0.8757",
                        product: "all"
                    },
                    {
                        phase: '2018M2',
                        sales: 2194822.96875,
                        quote: 2643496,
                        rate: "0.8303",
                        product: "all"
                    },
                    {
                        phase: '2018M3',
                        sales: 2359731.25,
                        quote: 2770609.75,
                        rate: "0.8517",
                        product: "all"
                    },
                    {
                        phase: '2018M4',
                        sales: 2165844.0625,
                        quote: 2914783.4375,
                        rate: "0.7431",
                        product: "all"
                    },
                    {
                        phase: '2018M5',
                        sales: 704715.671875,
                        quote: 2274136,
                        rate: "0.3099",
                        product: "all"
                    },
                    {
                        phase: '2018M6',
                        sales: 677539.40625,
                        quote: 2806879,
                        rate: "0.2414",
                        product: "all"
                    },
                    {
                        phase: '2018M7',
                        sales: 679346.203125,
                        quote: 2975934,
                        rate: "0.2283",
                        product: "all"
                    },
                    {
                        phase: '2018M8',
                        sales: 679346.203125,
                        quote: 2975934,
                        rate: "0.2283",
                        product: "all"
                    },
                    {
                        phase: '2018M9',
                        sales: 679346.203125,
                        quote: 2975934,
                        rate: "0.2283",
                        product: "all"
                    },
                    {
                        phase: '2018M10',
                        sales: 679346.203125,
                        quote: 2975934,
                        rate: "0.2283",
                        product: "all"
                    }
                ]
            }
            return this.parseData(data)
        }).then(data => {
            this.dataset = data
        })
        // this.dataset = this.parseData(data)
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
            tooltip?.setContent(function (data: any) {
                if (!data) {
                    return `<p>本市场暂无数据</p>`
                }
                return `
                        <p>${ data['phase']} 市场概况</p>
                        <p>市场规模${formatLocale("thousands").format("~s")(data['quote'])}</p>
                        <p>sales ${format(".2%")(data['sales'])}</p>`
            })
            tooltip?.show();
        })
        svg.on('mouseout', function () {
            tooltip?.hidden()
        })
    }

}
export default BarChart;
