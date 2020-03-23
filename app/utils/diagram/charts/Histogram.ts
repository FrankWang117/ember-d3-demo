import { Color, DataAdapter, DataSource, HistogramProperty, Position, Rotation, Size, }
    from '../index';

class Histogram {
    data: DataSource = new DataSource();
    adapter: DataAdapter = new DataAdapter();
    property: HistogramProperty;
    xAxis: any = null   // TODO interface Axis
    yAxis: any = null
    private defaultOpt: any = {
        dataset: [],
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
         let option = this.defaultOpt
         for(let item in option) {
             if(option.hasOwnProperty(item)) {
                option[item] = opt[item] || option[item]
             }
         }
         
        // opt = {...this.defaultOpt,...opt}
        this.xAxis = option.xAxis
        this.yAxis = option.yAxis
        // init DataSource
        this.data = new DataSource();
        this.data.data = option.dataset
        this.data.dimension = option.dimension
        // init DataAdapter
        this.adapter = new DataAdapter()
        // init HistogramProperty
        this.property = new HistogramProperty()
        this.property.hitSize = new Size(option.size.w, option.size.h);
        this.property.relativePos = new Position(option.position.x, option.position.y);
        this.property.rotate = new Rotation(option.rotate.degree)
        this.property.colorPool = option.colorPool.map((color:any) => new Color(...color))
    }
    draw(_selection:any) {

    }   
    scale(_opt:any,_grid:any):any {

    }
}
export default Histogram;