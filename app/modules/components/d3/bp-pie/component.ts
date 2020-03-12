import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { pie, arc, Arc, DefaultArcObject } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { animationType } from '../../../../utils/d3/animation';
import { interpolate } from 'd3-interpolate';
import Layout from 'ember-d3-demo/utils/d3/layout';
import { select, Selection, BaseType } from 'd3-selection';

interface D3BpPieArgs {
    data: string | number[]
    // data: [
    //     ["癫痫竞品1", 2575385.5, null, "0.1952"],
    //     ["开浦兰", 679346.1875, null, "0.0515"],
    //     ["癫痫竞品2", 279866.65625, null, "0.0212"],
    //     ["维派特", 0, null, "0.0000"],
    //     ["其他竞品", 9662320.65625, null, "0.7322"]
    //   ]
    width: number
    height: number
    innerRadius: number
    outerRadius: number
}

export default class D3BpPie extends Component<D3BpPieArgs> {
    @tracked data = this.args.data
    @tracked innerRadius = this.args.innerRadius || 84
    @tracked outerRadius = this.args.outerRadius || 100
    private container: Selection<BaseType, unknown, HTMLElement, null>// svg 容器
    width: number = 0 // svg width
    height: number = 0 // svg height
    arc: Arc<any, DefaultArcObject> = arc()
        .innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius);
    arcOver: Arc<any, DefaultArcObject> = arc()
        .innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius + (this.outerRadius - this.innerRadius));
    private arcTween(arc: any) {
        return function (a: any) {
            const i = interpolate(this._current, a);
            this._current = i(1);
            return (t: any) => arc(i(t));
        }
    }
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
        let layout = new Layout('.bp-pie')

        let { width, height } = this.args

        if (width) {
            layout.setWidth(width)
        } else {
            width = layout.getWidth()
        }
        if (height) {
            layout.setHeight(height)
        } else {
            height = layout.getHeight()
        }
        const container = layout.getContainer()
        this.width = layout.getWidth()
        this.height = layout.getHeight()
        this.container = container
        // 生成 svg
        let svg = layout.getSvg()
        // let svg = container.append('svg')
        //     .attr("width", width)
        //     .attr("height", height)

        const pieData = this.layoutData
        // 基础 rect 设置 / hover 状态 rect 的设置
        const { arc: arcins, arcOver } = this;

        svg.selectAll('path.arc')
            .data(pieData)
            .enter()
            .append('path')
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
            .attr('fill', (d: any, i: number) => schemeCategory10[i])
            .classed('arc', true)
            .attr('d', arcins);

        const t: any = animationType()

        svg.selectAll('path.arc')
            .on('mouseover', function () {
                select(this)
                    .transition(t)
                    .duration(1000)
                    .attr('d', arcOver)
            })
            .on('mouseout', function () {
                select(this)
                    .transition(t)
                    .duration(100)
                    .attr('d', arcins)
            })
    }
    @action
    updatePie() {
        const pieData = this.layoutData
        const svg = select('.bp-pie svg');
        const t: any = animationType();
        let { arc: arcins, arcOver } = this;

        svg.selectAll('path.arc')
            .data(pieData)
            .join(
                enter => enter.append("path"),
                update => update,
                exit => exit.remove()
            )
            .classed("arc", true)
            .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")")
            .attr('fill', (d: any, i: number) => schemeCategory10[i])
            .transition(t).duration(200).attrTween("d", this.arcTween(arcins));

        svg.selectAll('path.arc').on('mouseover', function () {
            select(this)
                .transition(t)
                .duration(1000)
                .attr('d', arcOver)
        })
            .on('mouseout', function () {
                select(this)
                    .transition(t)
                    .duration(100)
                    .attr('d', arcins)
            })

        // .attr('d', this.arc);
    }
}
