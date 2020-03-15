import { scaleLinear } from 'd3-scale';
import { axisLeft } from 'd3-axis';
import Layout from './layout';
import { getAxisSide } from './axisWidth'

const DEFAULT = {
    show: true,
    className: '',
    girdIndex: 0,
    position: 'bottom', // 'top'/'bottom'
    offset: 0, // 偏移量
    type: 'category',
    // 'value' 数值轴，适用于连续数据。
    // 'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
    // 'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
    // 'log' 对数轴。适用于对数数据。
    name: "",
    nameLocation: "end", // start / center / end
    min: 0,
    max: 0,
    splitNumber: 5,
}
class AxisBuilder {
    opt: any
    layout: Layout
    scale: any;
    axis: any;
    axisWidth: number = 0;
    // axis options
    constructor(layout: Layout, opt: any = DEFAULT) {
        this.opt = { ...DEFAULT, ...opt };
        this.layout = layout
    }
    public createAxis() {
        let grid = this.layout.getGrid();
        let svg = this.layout.getSvg();
        // TODO switch opt.type
        // y 轴 scale
        this.scale = scaleLinear()
            // TODO max & min 可以自行计算
            .domain([this.opt.min, this.opt.max])
            // 
            .range([grid.height - grid.padding.pt, grid.padding.pb]);
        this.axis = axisLeft(this.scale);
        svg.append('g')
            .classed("y-axis", true)
            .call(this.axis);
        this.axisWidth = getAxisSide(svg.select('.y-axis'));
        // TODO 移动应该放到 x 轴也生成之后执行
        svg.select(".y-axis")
            .attr("transform", `translate(${grid.padding.pl + this.axisWidth},0)`);

    }
    public getScale() {
        return this.scale
    }
    public getAxis() {
        return this.axis
    }
    public getAxisWidth() {
        return this.axisWidth
    }
}

export default AxisBuilder