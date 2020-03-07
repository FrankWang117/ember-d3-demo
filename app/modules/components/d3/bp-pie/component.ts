import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';
import { tracked } from '@glimmer/tracking';
import { pie, arc } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';

interface D3BpPieArgs {
    data: string | number[]
    // data: [
    //     ["癫痫竞品1", 2575385.5, null, "0.1952"],
    //     ["开浦兰", 679346.1875, null, "0.0515"],
    //     ["癫痫竞品2", 279866.65625, null, "0.0212"],
    //     ["维派特", 0, null, "0.0000"],
    //     ["其他竞品", 9662320.65625, null, "0.7322"]
    //   ]
    innerRadius: number
    outerRadius: number
}

export default class D3BpPie extends Component<D3BpPieArgs> {
    @tracked data = this.args.data
    @tracked innerRadius = this.args.innerRadius || 84
    @tracked outerRadius = this.args.outerRadius || 100
    container: any = null // svg 容器
    width: number = 0 // svg width
    height: number = 0 // svg height
    get layoutData() {
        let data = this.args.data
        const pieLayout = pie()
            // 设置如何从数据中获取要绘制的值
            .value((d: any) => d[1])
            // 设置排序规则 (null 表示原始排序)
            .sort(null)
            // 设置第一个数据的起始角度 (默认为 0)
            .startAngle(0)
            // 设置弧度的终止角度，(默认 2*Math.PI)
            // endAngle - startAngle 为 2 π 则表示一个整圆
            .endAngle(2 * Math.PI)
            // 弧度之间的空隙角度(默认 0)
            .padAngle(0);
        return pieLayout(data)
    }
    @action
    initPie() {
        const container = select('.bp-pie');
        // 声明变量 
        // TODO 如果能提取出去作为参数传入更好了
        const width: number = Number(container.style("width").split("p")[0])
        const height: number = Number(container.style("height").split("p")[0]);
        
        const { innerRadius, outerRadius } = this
        // 生成 svg
        let svg = container.append('svg')
            .attr("width", width)
            .attr("height", height)

        const pieData = this.layoutData
        // 基础 rect 设置
        let arcins = arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        // hover 状态 rect 的设置
        let arcOver = arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius + 15);

        svg.selectAll('path.arc')
            .data(pieData)
            .enter()
            .append('path')
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
            .attr('fill', (d: any, i: number) => schemeCategory10[i])
            .classed('arc', true)
            .attr('d', arcins);

        svg.selectAll('path.arc')
            .on('mouseover', function () {
                select(this)
                    .transition()
                    .duration(1000)
                    .attr('d', arcOver)
            })
            .on('mouseout', function () {
                select(this)
                    .transition()
                    .duration(100)
                    .attr('d', arcins)
            })
    }
}
