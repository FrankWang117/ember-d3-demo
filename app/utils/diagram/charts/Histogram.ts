import { Color, DataAdapter, DataSource, HistogramProperty, Position, Rotation, Size, }
    from '../index';
import { Selection } from 'd3-selection';
import AxisBuilder from '../scale/AxisBuilder';
import { max } from 'd3-array';
import { getAxisSide } from '../scale/axisTransform';
import { transition } from 'd3-transition';
import D3Tooltip from '../tooltip/Tooltip';

abstract class Histogram {
    public data: DataSource = new DataSource();
    protected dataset: any[] = [];
    adapter: DataAdapter = new DataAdapter();
    property: HistogramProperty;
    protected xAxis: any = null   // TODO interface Axis
    protected yAxis: any = null
    protected pieAxis: any = null
    protected dimensions: string[] = []
    public yAxisBuilder: AxisBuilder | undefined
    public xAxisBuilder: AxisBuilder | undefined
    // TODO 更好的方式?
    protected grid: any = null // 将 grid 单独从 option 中抽离出来
    protected geo: any = null
    protected polar: any = null
    private defaultOpt: any = {
        id: '',
        dataset: [],
        dimension: [],
        dimensions: [],
        measures: [],
        xAxis: {},
        yAxis: {},
        pieAxis: {},
        grid: {},
        geo: {},
        polar: {},
        position: {
            x: 0,
            y: 0
        },
        rotate: {
            degree: 0
        },
        colorPool: []
    }
    public option: any = null
    // 
    public updateData: Function = function(){}
    // tooltip instance
    protected tooltip: D3Tooltip | undefined = undefined
    protected selection: Selection<any,unknown,any,any> 
    
    constructor(opt: any) {
        // 通过 opt 对象，初始化 Histogram

        let option = this.defaultOpt
        for (let item in option) {
            if (option.hasOwnProperty(item)) {
                option[item] = opt[item] || option[item]
            }
        }
        this.option = option
        // opt = {...this.defaultOpt,...opt}
        this.xAxis = option.xAxis
        this.yAxis = option.yAxis
        this.pieAxis = option.pieAxis
        this.geo = option.geo
        this.polar = option.polar
        this.dimensions = option.dimensions
        // init DataSource
        this.data = new DataSource();
        this.data.dataset = option.dataset
        this.data.dimension = option.dimension
        // init DataAdapter
        this.adapter = new DataAdapter()
        // init HistogramProperty
        this.property = new HistogramProperty()
        this.property.hitSize = new Size(option.grid.width, option.grid.height);
        this.property.hitSize.setPadding(option.grid.padding)
        this.property.relativePos = new Position(option.position.x, option.position.y);
        this.property.rotate = new Rotation(option.rotate.degree)
        this.property.colorPool = option.colorPool.map((color: any) => new Color(color))
        this.grid = {
            padding: this.property.hitSize?.getPadding(),
            width: this.property.hitSize?.getWidth(),
            height: this.property.hitSize?.getHeight(),
            bgColor: new Color(option.grid.bgColor || 'transparent')
        }
    }
    public draw(selection: Selection<any, unknown, any, any>) {
        this.selection = selection
        this.resetSize(selection);
    }
    protected resetSize(selection: Selection<any, unknown, any, any>) {
        let grid = this.grid;
        let preSetWidth = parseFloat(grid.width);
        let preSetHeight = parseFloat(grid.height);
        if (isNaN(preSetWidth)) {
            let sWidth = parseFloat(selection.style('width'));
            this.property.hitSize.setWidth(sWidth);
            this.grid = { ...this.grid, width: sWidth };
        }
        if (isNaN(preSetHeight)) {
            let sHeight = parseFloat(selection.style('height'));
            this.property.hitSize.setHeight(sHeight);
            this.grid = { ...this.grid, height: sHeight };
        }
    }
    public scale(_svg: Selection<any, unknown, any, any>): any {

    }
    public parseData(originData: any[]): any[] {
        return this.adapter.parse(originData);
    }
    protected drawScale(axisOpt: any, grid: any) {
        const axisBuilderIns = new AxisBuilder(axisOpt, grid);
        axisBuilderIns.createAxis(axisBuilderIns.getScale(), axisOpt)
        return axisBuilderIns;
    }
    protected drawYaxis(svg: Selection<any, unknown, any, any>) {
        this.calcYaxisData();

        let yAxisBuilderIns = this.drawScale(this.yAxis, this.grid);
        // let yScale = yAxisIns.getScale();
        this.yAxisBuilder = yAxisBuilderIns
        svg.append('g')
            .classed(this.yAxis.className, true)
            // .attr("transform", `translate(${yAxismove[0]},${yAxismove[1]})`)
            .call(yAxisBuilderIns.getAxis());
        return yAxisBuilderIns;
    }
    // 在 update*axis 方法之后以及之前执行
    protected resetOffset(opt: any, edgeWidth: number) {
        // let { offset } = opt
        opt.edgeWidth = edgeWidth
        // opt.offset = offset && offset !== edgeWidth ? offset + edgeWidth : edgeWidth
    }
    // 每个更新需要执行两次?
    protected updateYaxis(yAxisBuilderIns: AxisBuilder, svg: Selection<any, unknown, any, any>) {
        let scale = yAxisBuilderIns.getScale();
        let opt = this.yAxis
        yAxisBuilderIns.createAxis(scale, opt);
        const axisSelection = svg.select(`.${opt.className}`)
        let yAxisWidth = getAxisSide(axisSelection);
        let yAxismove = yAxisBuilderIns.axisTransform(opt.position, yAxisWidth, this.grid)
        axisSelection
            .attr('transform', `translate(${yAxismove[0]},${yAxismove[1]})`)
            .call(yAxisBuilderIns.getAxis())
    }
    protected updateXaxis(xAxisBuilderIns: AxisBuilder, svg: Selection<any, unknown, any, any>) {
        let scale = xAxisBuilderIns.getScale();
        let opt = this.xAxis
        xAxisBuilderIns.createAxis(scale, opt);
        const axisSelection = svg.select(`.${opt.className}`)
        let xAxisHeight = getAxisSide(axisSelection, 'height');
        let xAxismove = xAxisBuilderIns.axisTransform(opt.position, xAxisHeight, this.grid)

        axisSelection
            .attr('transform', `translate(${xAxismove[0]},${xAxismove[1]})`)
            .call(xAxisBuilderIns.getAxis())
    }
    protected drawXaxis(svg: Selection<any, unknown, any, any>) {
        // const dataset = this.dataset;
        // const flatDataset = flatDeep(this.dataset);
        // this.xAxis = {
        //     ...this.xAxis, ...{
        //         data: flatDataset.map(datum => datum[this.xAxis.dimension]),
        //     }
        // }
        this.calcXaxisData()
        let xAxisBuilderIns = this.drawScale(this.xAxis, this.grid);
        this.xAxisBuilder = xAxisBuilderIns

        svg.append('g')
            .classed(this.xAxis.className, true)
            .call(xAxisBuilderIns.getAxis());
        return xAxisBuilderIns;
    }
    // 这个需要根据 x 轴 / y 轴展示的数据进行修改
    protected calcXaxisData() {
        // default xAxis type category
        this.xAxis = {
            ...this.xAxis, ...{
                data: this.dataset.map(datum => datum[this.xAxis.dimension]),
            }
        }
    }
    protected calcYaxisData() {
        const dataset = this.dataset;

        this.yAxis = {
            ...this.yAxis, ...{
                max: max(dataset.map(datum => datum[this.yAxis.dimension])),
            }
        }
    }
    protected transition() {
        return transition()
            .ease();
    }
    // 更新图表的操作
    protected updateChart(selection: Selection<any, unknown, any, any>) {
        selection.select('svg').remove();
        this.tooltip?.remove();
        this.draw(selection)
    }
}
export default Histogram;