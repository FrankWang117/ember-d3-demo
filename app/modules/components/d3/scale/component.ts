import Component from '@glimmer/component';
// import D3Component from 'ember-d3-demo/utils/d3/d3Component';
import { action } from '@ember/object';
import Layout from 'ember-d3-demo/utils/d3/layout';
import AxisBuilder from 'ember-d3-demo/utils/d3/axis';
import { timeMonth } from 'd3-time';
import { timeFormat } from 'd3-time-format';

interface D3ScaleArgs { }

export default class D3Scale extends Component<D3ScaleArgs> {
    @action
    initScale() {
        const curLayout = new Layout('.bp-scale.x-linear');
        const container = curLayout.getContainer();

        const pd = curLayout.getPadding();
        const svg = curLayout.getSvg()

        const xAxisOpt = {
            show: true,
            className: 'x-axis',
            girdIndex: 0,
            position: 'bottom', // 'top'/'bottom'/left/right
            offset: 25.52,  // 偏移量。 y 轴的偏移量比较容易预设，可为 x 轴的高度以及
            // legend（如果是底部）的和。
            // 当先生成 y 轴的时候，offset 可以为0，会自动计算 y 轴宽度。
            // x 轴的偏移量最好是动态计算 y 轴的宽度。
            type: 'value',
            // 'value' 数值轴，适用于连续数据。
            // 'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
            // 'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
            // 'log' 对数轴。适用于对数数据。
            name: "",
            nameLocation: "end", // start / center / end
            min: 0,
            max: 100,
            splitNumber: 5,
            data: null
        }
        const xaAxis = new AxisBuilder(curLayout, xAxisOpt)
        const yAxisOpt = {
            show: true,
            className: 'y-axis',
            girdIndex: 0,
            position: 'left', // 'top'/'bottom'/left/right
            offset: 19.11, // 对于 left / right offset 可以先设置为 0，在确定x轴的高度后，再修改为
            // x 轴的高度，有底部 legend 的时候也要把legend 高度添加
            type: 'value',
            name: "",
            min: 0,
            max: 100
        }
        const yAxis = new AxisBuilder(curLayout, yAxisOpt)
    }
    @action
    initBand() {
        const curLayout = new Layout('.bp-scale.band');

        const yAxisOpt = {
            show: true,
            className: 'x-axis',
            girdIndex: 0,
            position: 'bottom', // 'top'/'bottom'/left/right
            offset: 0,
            type: 'category',
            name: "",
            min: 0,
            max: 100,
            data: ["2018Q1", "2018Q2", "2018Q3", "2018Q4", "2019Q1", "2019Q2", "2019Q3"]
        }
        const axis = new AxisBuilder(curLayout, yAxisOpt)
    }
    @action
    initTime() {
        const curLayout = new Layout('.bp-scale.band');
        const svg = curLayout.getSvg()

        const yAxisOpt = {
            show: true,
            className: 'x-axis',
            girdIndex: 0,
            position: 'bottom', // 'top'/'bottom'/left/right
            offset: 0,
            type: 'time',
            name: "",
            min: new Date(2015, 0, 1),
            max: new Date(2016, 0, 1),
            formatter: () => timeFormat('%y-%m')
        }
        const axisIns = new AxisBuilder(curLayout, yAxisOpt)
        const xAxis = axisIns.getAxis()
            .ticks(timeMonth.every(2))
            .tickFormat(timeFormat('%y-%m'))

        svg.select(`.${yAxisOpt.className}`)
            .call(xAxis)
    }
}
