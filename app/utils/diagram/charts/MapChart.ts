import Histogram from './Histogram';
import { Selection, select, clientPoint } from 'd3-selection';
import { json, xml } from 'd3-fetch';
import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { geoPath, geoMercator } from 'd3-geo';
import { animationType, tweenDash } from '../animation/animation';
import StateMachine from 'javascript-state-machine';
import D3Tooltip from '../tooltip/Tooltip';
import { formatLocale, format } from 'd3-format';

class MapChart extends Histogram {
    private fsm: any = null
    private tooltip: D3Tooltip | undefined
    private selection: Selection<any, unknown, any, any>
    constructor(opt: any) {
        super(opt)
        this.dataset = this.parseData(this.data.dataset);
        this.fsm = new StateMachine({
            init: 'china',
            transitions: [
                { name: 'drilldown', from: 'china', to: 'province' },
                { name: 'scrollup', from: 'province', to: 'china' }
            ]
        })
    }
    draw(selection: any) {
        // selection are chart container
        super.draw(selection);
        // 将 svg 容器放到全局,供 update 使用
        this.selection = selection;
        let grid = this.grid;

        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height);

        this.tooltip = new D3Tooltip(selection, 'b-tooltip');

        async function flow(this: any) {
            await this.queryData()
            // 无坐标轴(dimension 信息保存在 geo 中);
            // this.scale(svg);
            // draw map
            await this.drawMap(svg)
            // 添加交互
            this.mouseAction(svg);
            // 测试交互
            this.testInteraction(svg);
        }
        flow.call(this)

    }
    testInteraction(svg: Selection<any, unknown, any, any>) {
        let fsm = this.fsm;
        let self = this,
            selection = this.selection;

        svg.selectAll('path').on('click', function (d:any) {
            let prov = d
            console.log(prov)
            if (fsm.state === 'province') {
                fsm.scrollup()
            } else {
                fsm.drilldown()
            }
            self.updateChart(selection);
        })
    }
    updateChart(selection: Selection<any, unknown, any, any>) {
        selection.select('svg').remove();
        this.tooltip?.remove();
        this.draw(selection)
    }
    queryData() {
        let fsm = this.fsm,
            dimension = fsm.state,
            data: any[] = [];

        return new Promise((resolve, reject) => {
            resolve('query data')
        }).then(res => {
            console.log(res);
            if (dimension === 'china') {
                data = [
                    {
                        label: '山东省',
                        sales: 22000.25,
                        quote: 2584466.75,
                        rate: "0.8757",
                        product: "all"
                    },
                    {
                        label: '广东省',
                        sales: 2194822.975,
                        quote: 2643496,
                        rate: "0.8303",
                        product: "all"
                    },
                    {
                        label: '北京市',
                        sales: 2359731.25,
                        quote: 2770609.75,
                        rate: "0.8517",
                        product: "all"
                    },
                    {
                        label: '陕西省',
                        sales: 2165844.0625,
                        quote: 2914783.4375,
                        rate: "0.7431",
                        product: "all"
                    },
                    {
                        label: '吉林省',
                        sales: 704715.671875,
                        quote: 2274136,
                        rate: "0.3099",
                        product: "all"
                    },
                    {
                        label: '广西壮族自治区',
                        sales: 677539.40625,
                        quote: 2806879,
                        rate: "0.2414",
                        product: "all"
                    },
                    {
                        label: '内蒙古自治区',
                        sales: 679346.203125,
                        quote: 2975934,
                        rate: "0.2283",
                        product: "all"
                    }
                ]
            } else if (dimension === 'province') {
                data = [
                    {
                        label: '济南市',
                        sales: 2000.25,
                        quote: 258466.75,
                        rate: "0.18757",
                        product: "all"
                    },
                    {
                        label: '济宁市',
                        sales: 214822.975,
                        quote: 243496,
                        rate: "0.303",
                        product: "all"
                    },
                    {
                        label: '青岛市',
                        sales: 259731.25,
                        quote: 270609.75,
                        rate: "0.517",
                        product: "all"
                    },
                    {
                        label: '烟台市',
                        sales: 165844.0625,
                        quote: 914783.4375,
                        rate: "0.431",
                        product: "all"
                    },
                    {
                        label: '聊城市',
                        sales: 4715.75,
                        quote: 274136,
                        rate: "0.3099",
                        product: "all"
                    },
                    {
                        label: '枣庄市',
                        sales: 77539.25,
                        quote: 806879,
                        rate: "0.14",
                        product: "all"
                    },
                    {
                        label: '潍坊市',
                        sales: 79346.2,
                        quote: 275934,
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
    private drawMap(svg: Selection<any, unknown, any, any>) {
        let { grid, property: p, geo, dataset } = this;
        // const tooltipIns = new D3Tooltip(container, 'map-tooltip')

        const maxData = max(dataset.map((datum: any[]) => datum[geo.dimension]))
        // const minData = min(dataset.map((datum: any[]) => datum[geo.dimension]))

        const color = scaleLinear()
            .domain([0, maxData])
            .range(['#B8D4FA', '#18669A']);
        // .range(["#E7F0FE","#B8D4FA","#8ABCF4","#5CA6EF",
        //     "#3492E5",
        //     "#1E7EC8",
        //     "#18669A"
        // ])
        return xml("../json/southchinasea.svg").then(xmlDocument => {
            svg.html(function () {
                return select(this).html() + xmlDocument.getElementsByTagName("g")[0].outerHTML;
            });
            const southSea = select("#southsea")

            let southSeaWidth = southSea.node().getBBox().width / 5
            let southSeaH = southSea!.node().getBBox().height / 5
            select("#southsea")
                .classed("southsea", true)
                .attr("transform", `translate(${grid.width - southSeaWidth - grid.padding.pr},${grid.height - southSeaH - grid.padding.pb}) scale(0.2)`)
                .attr("fill", "#fafbfc");

            return json('../json/chinawithoutsouthsea.json')
        })
            .then(geoJson => {
                const projection = geoMercator()
                    .fitSize([grid.width, grid.height], geoJson);
                const path = geoPath().projection(projection);

                const paths = svg
                    .selectAll("path.map")
                    .data(geoJson.features)
                    .enter()
                    .append("path")
                    .classed("map", true)
                    .attr("fill", "#fafbfc")
                    .attr("stroke", "white")
                    .attr("class", "continent")
                    .attr("d", path);

                const t = animationType();

                paths.transition(t)
                    .duration(1000)
                    .attr('fill', (d: any) => {
                        let prov = d.properties.name;
                        let curProvData = dataset.find((provData: any) => provData['label'] === prov)

                        return color(curProvData ? curProvData[geo.dimension] : 0)
                    });
            });


    }
    private showRect(svg:Selection<any,unknown,any,any>) {
        // 显示渐变矩形条
        const linearGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "linearColor")
            //颜色渐变方向
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");
        // //设置矩形条开始颜色
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", '#8ABCF4');
        // //设置结束颜色
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", '#18669A');

        // svg.append("rect")
        //     //x,y 矩形的左上角坐标
        //     .attr("x", 24)
        //     .attr("y", layout.getHeight() - 83 - layout.getPadding().pb) // 83为矩形的高
        //     //矩形的宽高
        //     .attr("width", 16)
        //     .attr("height", 83)
        //     //引用上面的id 设置颜色
        //     .style("fill", "url(#" + linearGradient.attr("id") + ")");
        // //设置文字

        // // 数据初值
        // svg.append("text")
        //     .attr("x", layout.getPadding().pl + 16 + 8)
        //     .attr("y", layout.getHeight() - layout.getPadding().pb)
        //     .text(0)
        //     .classed("linear-text", true);
        // // visualMap title
        // svg.append("text")
        //     .attr("x", layout.getPadding().pl)
        //     .attr("y", layout.getHeight() - 83 - layout.getPadding().pb - 8) // 8为padding
        //     .text('市场规模')
        //     .classed("linear-text", true);
        // //数据末值
        // svg.append("text")
        //     .attr("x", layout.getPadding().pl + 16 + 8)
        //     .attr("y", layout.getHeight() - 83 - layout.getPadding().pb + 12) // 12 为字体大小
        //     .text(format("~s")(maxData))
        //     .classed("linear-text", true)
    }
    private mouseAction(svg: Selection<any, unknown, any, any>) {
        let { grid, property: p, dataset, tooltip } = this,
            { pl, pr } = grid.padding,
            leftBlank = pl;
        svg.selectAll("path").on('mousemove', function (d: any) {
            const curSelect = select(this);
            curSelect.classed('path-active', true);

            let prov = d.properties.name,
                curData: any[] = dataset.find((provData: any) => provData['label'] === prov)

            let p = clientPoint(this, event);
            tooltip?.updatePosition(p);
            tooltip?.setCurData(curData);
            tooltip?.setContent(function (data: any) {
                if (!data) {
                    return `<p>本市场暂无数据</p>`
                }
                return `
                        <p>${ data['label']} 市场概况</p>
                        <p>市场规模${formatLocale("thousands").format("~s")(data['quote'])}</p>
                        <p>sales ${format(".2%")(data['sales'])}</p>`
            })
            tooltip?.show();
        })
        svg.selectAll("path").on('mouseout', function () {
            select(this)
                .classed('path-active', false);
            tooltip?.hidden();
        })
    }
}
export default MapChart;
