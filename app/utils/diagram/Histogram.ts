import { Color, DataAdapter, DataSource, HistogramProperty, Position, Rotation, Size, }
    from './index';

class Histogram {
    data: DataSource = new DataSource();
    adapter: DataAdapter = new DataAdapter();
    property: HistogramProperty;
    xAxis: any = null   // TODO interface Axis
    yAxis: any = null
    private defaultOpt: any = {
        data: [],
        dimension: [],
        xAxis:{},
        yAxis: {},
        size: {
            w: 700,
            h: 400
        },
        position: {
            x: 0,
            y: 0
        },
        rotate: {
            degree: 0
        },
        colorPool: []
    }
    constructor(opt: any) {
        // 通过 opt 对象，初始化 Histogram
        /**
         *
         */
        opt = {...this.defaultOpt,...opt}
        this.xAxis = opt.xAxis
        this.yAxis = opt.yAxis
        // init DataSource
        this.data = new DataSource();
        this.data.data = opt.data
        this.data.dimension = opt.dimension
        // init DataAdapter
        this.adapter = new DataAdapter()
        // init HistogramProperty
        this.property = new HistogramProperty()
        this.property.hitSize = new Size(opt.size.w, opt.size.h);
        this.property.relativePos = new Position(opt.position.x, opt.position.y);
        this.property.rotate = new Rotation(opt.rotate.degree)
        this.property.colorPool = [new Color(...opt.color)]
    }
    draw(selection) {

    }   
    scale(opt:any,grid:any):any {

    }
}
export default Histogram;