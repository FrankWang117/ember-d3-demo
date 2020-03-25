import { scaleLinear, scaleBand, scaleTime, scaleLog } from 'd3-scale';
import { axisLeft, axisRight, axisBottom, axisTop, AxisDomain, Axis } from 'd3-axis';

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
    scale: any;
    axis: any;
    grid: any;
    defaultGrid: any = {
        padding: {
            pt: 24,
            pr: 24,
            pb: 24,
            pl: 24,
        },
        width: 200,
        height: 200
    }
    // axis options
    constructor(opt: any = DEFAULT, grid: any) {
        this.opt = { ...DEFAULT, ...opt };
        this.grid = { ...this.defaultGrid, ...grid }
        this.scale = this.rangeScale(this.opt);
    }
    public createAxis(scale: any, option: any) {
        this.opt = option
        this.setScaleDomain(scale, option)
        this.axis = this.directionAxis(scale, option.position);
        // svg.append('g')
        //     .classed(this.opt.className, true)
        //     .call(this.axis);
        // this.axisWidth = getAxisSide(svg.select('.y-axis'));
        // TODO 移动应该放到 x 轴也生成之后执行
        // svg.select(".y-axis")
        //     .attr("transform", `translate(${grid.padding.pl + this.axisWidth},0)`);
        // this.axisTransform(this.opt.position, grid)
    }

    private rangeScale(option: any) {
        let { type } = option;
        // switch (position) {
        //     case 'bottom':
        //     case 'top':
        //         range = [padding.pl +  offset, width - padding.pr]
        //         break;
        //     case 'right':
        //     case 'left':
        //     default:
        //         range = [height - padding.pt - offset, padding.pb]
        // }
        let scaleType = null;
        switch (type) {
            case 'category':
                scaleType = scaleBand()
                break;
            case 'time':
                scaleType = scaleTime()
                break;
            case 'log':
                scaleType = scaleLog();
                break;
            case 'value':
            default:
                // 数值轴，适用于连续数据
                scaleType = scaleLinear()
                break;
        }
        return scaleType
        // TODO max & min 可以自行计算
        // .domain([min, max])
        // .range(range);
    }
    private setScaleDomain(scale: any, option: any) {
        let range: number[] = [0, 0];
        let { padding, width, height } = this.grid;
        let { offset, position, type, min, max, data } = option;
        let domain: any[] = [min, max]
        switch (position) {
            case 'bottom':
            case 'top':
                range = [padding.pl + offset, width - padding.pr]
                break;
            case 'right':
            case 'left':
            default:
                range = [height - padding.pt - offset, padding.pb]
        }
        switch (type) {
            case 'category':
                scale = scale
                    .domain(data)
                    .range((<[number, number]>range))
                break;
            case 'log':
                scale = scaleLog();
                break;
            case 'value':
            case 'time':
            default:
                // 数值轴，适用于连续数据
                scale = scale
                    // TODO max & min 可以自行计算
                    .domain(domain)
                    .range(range);
                break;
        }
        return scale
    }
    public directionAxis(scale: any, direction: string): Axis<AxisDomain> {
        let axis: Axis<AxisDomain>
        // let { formatter } = this.opt;
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

    public axisTransform(position:string,edgeWidth:number, grid: any) {
        let distance: number[] = [0, 0];
        let { padding, height, width } = grid;
        
        switch (position) {
            case 'bottom':
                distance = [0, height - padding.pb - edgeWidth];
                break;
            case 'top':
                distance = [padding.pl, padding.pt];
                break;
            case 'right':
                distance = [width - padding.pr - edgeWidth, 0];
                break;
            case 'left':
                distance = [padding.pl + edgeWidth, 0];
                break;
            default:
                break;
        }
        return distance;

    }
}

export default AxisBuilder