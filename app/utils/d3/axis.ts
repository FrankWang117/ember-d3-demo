import { scaleLinear } from 'd3-scale';
import { axisLeft, axisRight, axisBottom, axisTop, AxisDomain, Axis } from 'd3-axis';
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
        switch (this.opt.type) {
            case 'value':
                console.log("value axis");
                break;
            case 'category':
            default:
                this.createAxis();
                break;
        }
    }
    public createAxis() {
        let grid = this.layout.getGrid();
        let svg = this.layout.getSvg();

        this.scale = this.rangeScale(this.opt.position, grid);
        this.axis = this.directionAxis(this.opt.position);
        svg.append('g')
            .classed(this.opt.className, true)
            .call(this.axis);
        // this.axisWidth = getAxisSide(svg.select('.y-axis'));
        // TODO 移动应该放到 x 轴也生成之后执行
        // svg.select(".y-axis")
        //     .attr("transform", `translate(${grid.padding.pl + this.axisWidth},0)`);
        this.axisTransform(this.opt.position, grid)
    }
    private axisTransform(dir: string, grid: any) {
        let distance: number[] = [0, 0];
        let svg = this.layout.getSvg();
        let { padding, height, width } = grid;
        let yAxisWidth = getAxisSide(svg.select('.y-axis'));
        let xAxisHeight = getAxisSide(svg.select('.x-axis'), 'height');

        switch (dir) {
            case 'bottom':
                distance = [0, height - padding.pb - xAxisHeight];
                break;
            case 'top':
                distance = [padding.pl, padding.pt];
                break;
            case 'right':
                distance = [width - padding.pr - yAxisWidth, 0];
                break;
            case 'left':
                distance = [padding.pl + yAxisWidth, 0];
                break;
            default:
                break;
        }

        svg.select(`.${this.opt.className}`)
            .attr("transform", `translate(${distance[0]},${distance[1]})`);

    }
    private rangeScale(direction: string, grid: any) {
        let range: number[] = [0, 0];
        let { padding, width, height } = grid;

        switch (direction) {
            case 'bottom':
            case 'top':
                let svg = this.layout.getSvg()
                let yAxisWidth = getAxisSide(svg.select('.y-axis'))
                range = [padding.pl, width - padding.pr - yAxisWidth]
                break;
            case 'right':
            case 'left':
            default:
                range = [height - padding.pt, padding.pb + this.opt.offset]
        }
        return scaleLinear()
            // TODO max & min 可以自行计算
            .domain([this.opt.min, this.opt.max])
            .range(range);
    }
    private directionAxis(direction: string): Axis<AxisDomain> {
        // let axis: Axis<AxisDomain>
        switch (direction) {
            case 'right':
                return axisRight(this.scale)
                break;
            case 'bottom':
                return axisBottom(this.scale)
                break;
            case 'top':
                return axisTop(this.scale)
                break;
            case 'left':
            default:
                return axisLeft(this.scale)
                break;
        }
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