import Histogram from './Histogram';
import { Selection } from 'd3-selection';
import { pie, arc, Arc, DefaultArcObject } from 'd3-shape';

class PieChart extends Histogram {
    constructor(opt: any) {
        super(opt)
        this.dataset = this.parseData(this.data.dataset)
    }
    draw(selection: any) {
        // selection are chart container
        let p = this.property;
        let grid = this.grid;

        let svg = selection.append('svg')
            .attr('width', grid.width)
            .attr('height', grid.height)
        // 饼图无坐标轴(dimension 信息保存在 xAxis 中)
        // this.scale(svg);
        this.drawPie(svg)
        

    }
    public parseData(data:any[]) {
        console.log(this.pieAxis)
        const pieLayout = pie()
            // 设置如何从数据中获取要绘制的值()
            .value((d: any) => d[this.pieAxis.dimension])
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
    private drawPie(svg: Selection<any, unknown, any, any>) {
        let { grid, pieAxis, property: p } = this;
        const preArc: Arc<any, DefaultArcObject> = arc()
            .innerRadius(pieAxis.radius[0])
            .outerRadius(pieAxis.radius[1]);
            
        svg.selectAll('path.arc')
            .data(this.dataset)
            .enter()
            .append('path')
            .attr("transform", "translate(" + (grid.width / 2) + "," + (grid.height / 2) + ")")
            .attr('fill', (_d: any, i: number) => <string>p.colorPool[i].HEX())
            .classed('arc', true)
            .attr('d', preArc);
    }
}
export default PieChart;
