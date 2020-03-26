import Histogram from './Histogram';
import { Selection, select } from 'd3-selection';
import { json, xml } from 'd3-fetch';
import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { geoPath, geoMercator } from 'd3-geo';
import { animationType, tweenDash } from '../animation/animation';

class MapChart extends Histogram {
    constructor(opt: any) {
        super(opt)
        this.dataset = this.parseData(this.data.dataset)
    }
    draw(selection: any) {
        // selection are chart container
        super.draw(selection)
        let grid = this.grid;

        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)
        // 饼图无坐标轴(dimension 信息保存在 xAxis 中)
        // this.scale(svg);
        this.drawMap(svg)
    }
    public parseData(data: any[]) {
        return data
        // const pieLayout = pie()
        //     // 设置如何从数据中获取要绘制的值()
        //     .value((d: any) => d[this.pieAxis.dimension])
        //     // 设置排序规则 (null 表示原始排序)
        //     .sort(null)
        //     // 设置第一个数据的起始角度 (默认为 0)
        //     .startAngle(0)
        //     // 设置弧度的终止角度，(默认 2*Math.PI)
        //     // endAngle - startAngle 为 2 π 则表示一个整圆
        //     .endAngle(2 * Math.PI)
        //     // 弧度之间的空隙角度(默认 0)
        //     .padAngle(0);
        // return pieLayout(data)
    }
    private drawMap(svg: Selection<any, unknown, any, any>) {
        let { grid,property: p, geo, dataset } = this;
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
        xml("../json/southchinasea.svg").then(xmlDocument => {
            svg.html(function () {
                return select(this).html() + xmlDocument.getElementsByTagName("g")[0].outerHTML;
            });
            const southSea = select("#southsea")

            let southSeaWidth = southSea.node().getBBox().width / 5
            let southSeaH = southSea!.node().getBBox().height / 5
            select("#southsea")
                .classed("southsea", true)
                .attr("transform", `translate(${grid.width - southSeaWidth - grid.padding.pr},${grid.height - southSeaH - grid.padding.pb}) scale(0.2)`)
                .attr("fill","#fafbfc");

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
                    .attr("d", path)
                    .on('mouseover', function (_d: any) {
                        const curSelect = select(this);
                        curSelect.classed('path-active', true);

                        // let prov = d.properties.name;
                        // let curProvData: any[] = dataset.find((provData: any) => provData['label'] === prov)

                        // tooltipIns.setCurData(curProvData);
                        // tooltipIns.show();
                        // tooltipIns.setContent(function (data: any) {
                        //     if (!data) {
                        //         return `<p>本市场暂无数据</p>`
                        //     }
                        //     return `
                        //         <p>${ data[0]} 市场概况</p>
                        //         <p>市场规模${formatLocale("thousands").format("~s")(data[2])}</p>
                        //         <p>EI ${format(".2%")(data[1])}</p>`
                        // })
                    })
                    .on('mouseout', function () {
                        select(this)
                            .classed('path-active', false);

                        // tooltipIns.hidden()
                        // selectAll('p').remove()
                    });

                const t = animationType();

                paths.transition(t)
                    .duration(1000)
                    .attr('fill', (d: any) => {
                        let prov = d.properties.name;
                        let curProvData = dataset.find((provData: any) => provData['label'] === prov)

                        return color(curProvData ? curProvData[geo.dimension] : 0)
                    });
            });
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
}
export default MapChart;
