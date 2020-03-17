import { scaleLinear, scaleBand, scaleTime, scaleLog } from 'd3-scale';
import { axisLeft, axisRight, axisBottom, axisTop, AxisDomain, Axis } from 'd3-axis';
import Layout from './layout';
import { getAxisSide } from './axisWidth'

const DEFAULT = {
    show: true, // 暂时无作用
    className: '',  // 展示的坐标轴类名，TODO 默认添加 y-axis-l/y-axis-r/x-axis-t/x-axis-b
    girdIndex: 0,   // 暂时无作用
    position: 'bottom', // 'top'/'bottom'/‘left'/'right'
    offset: 0, // 偏移量. y 轴的偏移量比较容易预设，可为 x 轴的高度以及
    // legend（如果是底部）的和。
    // 当先生成 y 轴的时候，offset 可以为 0，会自动计算 y 轴宽度。
    // x 轴的偏移量最好是动态计算 y 轴的宽度。
    type: 'value',
    // 'value' 数值轴，适用于连续数据。 default
    // 'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
    // 'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
    // 'log' 对数轴。适用于对数数据。
    name: "",   // 暂时无作用
    nameLocation: "end", // start / center / end
    min: 0,     // 最小值。当type 为 time 时，应为 new Date()
    max: 0,     // 最大值。
    data: null, // category 必须
    splitNumber: 5, // 坐标轴的分割段数，需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
    ticks: [5],     // ticks & formatter 暂不支持，可以在外部进行对坐标轴更新来格式化 ticks
    formatter: null
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
            case 'category':
                console.log("category axis");
            // break;
            case 'value':
            default:
                this.createAxis();
                break;
        }
    }
    public createAxis() {
        let grid = this.layout.getGrid();
        let svg = this.layout.getSvg();

        this.scale = this.rangeScale(this.opt, grid);
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
    private rangeScale(option: any, grid: any) {
        let range: number[] = [0, 0];
        let { padding, width, height } = grid;
        let { offset, position, type, min, max, data } = option;
        let domain: any[] = [min, max]
        switch (position) {
            case 'bottom':
            case 'top':
                let svg = this.layout.getSvg()
                let yAxisWidth = getAxisSide(svg.select('.y-axis'))
                range = [padding.pl + yAxisWidth + offset, width - padding.pr]
                break;
            case 'right':
            case 'left':
            default:
                range = [height - padding.pt - offset, padding.pb]
        }
        let scaleType = null

        switch (type) {
            case 'category':
                scaleType = scaleBand()
                    .domain(data)
                    .range((<[number, number]>range))
                break;
            case 'time':
                scaleType = scaleTime()
                    .domain(domain)
                    .range(range);
                break;
            case 'log':
                scaleType = scaleLog();
                break;
            case 'value':
            default:
                // 数值轴，适用于连续数据
                scaleType = scaleLinear()
                    // TODO max & min 可以自行计算
                    .domain(domain)
                    .range(range);
                break;
        }
        return scaleType
        // TODO max & min 可以自行计算
        // .domain([min, max])
        // .range(range);
    }
    private directionAxis(direction: string): Axis<AxisDomain> {
        let axis: Axis<AxisDomain>
        // let { formatter } = this.opt;
        let scale = this.scale
        // if (formatter instanceof Function) {
        //     formatter = formatter()
        // }
        switch (direction) {
            case 'right':
                axis = axisRight(scale);
                break;
            case 'bottom':
                axis = axisBottom(scale);
                break;
            case 'top':
                axis = axisTop(scale);
                break;
            case 'left':
            default:
                axis = axisLeft(scale);
                break;
        }
        return axis;

    }
    public getScale() {
        return this.scale
    }
    public getAxis() {
        return this.axis
    }
    // public getAxisWidth() {
    //     return this.axisWidth
    // }
}

export default AxisBuilder