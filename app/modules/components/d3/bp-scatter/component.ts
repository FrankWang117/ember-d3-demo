import Component from '@glimmer/component';
import { action } from '@ember/object';
import Layout from 'ember-d3-demo/utils/d3/layout';
import { scaleLinear } from 'd3-scale';
import { max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { getYAxisWidth } from 'ember-d3-demo/utils/d3/yAxisWidth';
import { format, formatLocale } from 'd3-format';
import { schemeSet3 } from 'd3-scale-chromatic';
import { animationType } from 'ember-d3-demo/utils/d3/animation'
import { select, selectAll } from 'd3-selection';
import D3Tooltip from "ember-d3-demo/utils/d3/tooltip";
/**
 * 为图表添加提示框的步骤
    - 引入 import D3Tooltip from "ember-d3-demo/utils/d3/tooltip"; // 可封装进组件
    - 生成实例 参数：container ，classname 
    - mouseover 将 content 设置
    - mouseout 移除相关类
    
 */
interface D3BpScatterArgs {
    data: any;
    /**
    [
        ["CITY", "PROV_MOM(市场增长率)", "CITY_MOM(产品增长率)", "CITY_SALES"],
        ["三门峡市", 0.03661353886127472, 0.0267854742705822, 1503753.625],
        ["信阳市", 0.03661353886127472, 0.021118011325597763, 3141647],
        ["南阳市", 0.03661353886127472, 0.009368316270411015, 6627635],
        ["周口市", 0.03661353886127472, 0.10186182707548141, 3373589],
        ["商丘市", 0.03661353886127472, 0.07964722067117691, 3416614.75],
        ["安阳市", 0.03661353886127472, -0.04314463213086128, 2674676.5],
        ["平顶山市", 0.03661353886127472, -0.058747705072164536, 4709144.5],
        ["开封市", 0.03661353886127472, -0.05621219053864479, 2482781],
        ["新乡市", 0.03661353886127472, -0.03616794943809509, 3960186.75],
        ["洛阳市", 0.03661353886127472, -0.033699262887239456, 5285980.5],
        ["济源市", 0.03661353886127472, 0.0066471765749156475, 501105.1875],
        ["漯河市", 0.03661353886127472, 0.025013713166117668, 1548921.5],
        ["濮阳市", 0.03661353886127472, 0.01931016333401203, 2402496.75],
        ["焦作市", 0.03661353886127472, -0.1028456762433052, 2677141],
        ["许昌市", 0.03661353886127472, 0.11013109982013702, 2085245.375],
        ["驻马店市", 0.03661353886127472, 0.1704568713903427, 2854248.25],
        ["鹤壁市", 0.03661353886127472, 0.0008722419734112918, 754340.875],
        ["郑州市", 0.03661353886127472, 0.2283380776643753, 10153230]
    ]   
    */
}

export default class D3BpScatter extends Component<D3BpScatterArgs> {
    private getAxisMaxValue(data: any, property: number | string) {
        const yAxisData: number[] = data.map((datum: any) => datum[property])
        return Math.max(
            Math.abs((<number>min(yAxisData))),
            Math.abs((<number>max(yAxisData)))
        );
    }
    @action
    initChart() {
        const curLayout = new Layout('.bp-scatter');
        const container = curLayout.getContainer();
        const tooltipIns = new D3Tooltip(container, 'scatter-tooltip')

        const pd = curLayout.getPadding();
        const data = this.args.data;
        const svg = container.append('svg')
            .attr("width", curLayout.getWidth())
            .attr("height", curLayout.getHeight())
            .classed("scatter-svg", true)
            .style("background-color", "#fafbfc");

        // y 轴
        let yMaxValue = this.getAxisMaxValue(data, 2)

        const yScale = scaleLinear()
            .domain([-1 * yMaxValue, yMaxValue])
            .range([curLayout.getHeight() - pd.pt, pd.pb]);


        const yAxis = axisLeft(yScale)
            .tickFormat(format(".2%")); // format([.precision][type])

        const yAxisIns = svg.append('g')
            .classed('y-axis', true)
            .call(yAxis);

        const yAxisWidth = getYAxisWidth(yAxisIns)
        yAxisIns.attr("transform", `translate(${pd.pl + yAxisWidth},0)`)

        // x轴
        let xMaxValue = this.getAxisMaxValue(data, 1)

        const xScale = scaleLinear()
            .domain([-1 * xMaxValue, xMaxValue])
            .range([pd.pl + yAxisWidth, curLayout.getWidth() - pd.pr]);

        const xAxis = axisBottom(xScale)
            .tickFormat(format(".2%"))

        const xAxisIns = svg.append('g')
            .classed("x-axis", true)
            .call(xAxis)

        xAxisIns
            .attr('transform', `translate(0,${curLayout.getHeight() - pd.pt})`);

        // 数据大小比例尺
        let dataMaxValue = this.getAxisMaxValue(data, 3)
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
            ).attr('cx', (d: any) => xScale(d[1]))
            .attr('cy', (d: any) => yScale(d[2]))

        circle.transition(t)
            .duration(1600)
            .attr('r', (d: any) => dataScale(d[3]))
            .attr('fill', (_d: any, i: number) => schemeSet3[i])
            .style('opacity', 0.6)

        circle.on('mouseover', function (d: any) {
            select(this)
                .transition(t)
                .duration(1600)
                .attr('r', () => dataScale(d[3]) * 1.4);

            tooltipIns.setCurData(d);
            tooltipIns.getTooltip()
                .classed("d-none", false);
            tooltipIns.setContent(function (data: any) {
                console.log("data")
                if (!data) {
                    return `<p>暂无数据</p>`
                }
                return `<p>${ data[0]}</p>
                        <p>产品销量${formatLocale("thousands").format("~s")(data[3])}</p>
                        <p>产品销量增长率 ${format(".2%")(data[2])}</p>
                        <p>市场增长率 ${format(".2%")(data[1])}</p>`
            })
        }).on('mouseout', function (d: any) {
            select(this)
                .transition(t)
                .duration(1200)
                .attr('r', () => dataScale(d[3]));
            container.select('.scatter-tooltip')
                .classed("d-none", true)
            selectAll('p').remove()
        })


    }
}
