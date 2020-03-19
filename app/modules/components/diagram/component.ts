import Component from '@glimmer/component';
import { DataAdapter, DataSource, Histogram, HistogramProperty, Notation, Text }
    from 'ember-d3-demo/utils/diagram/index';
import { action } from '@ember/object';
import {select, selection} from 'd3-selection';

interface DiagramArgs {
    histogram: Histogram;  // 绘制的图表类型
    commonts: Text[];      // 查看图表的人对图表的评论
    title: Text;        // 图表 title
    notation: Notation  // 图例
}

export default class Diagram extends Component<DiagramArgs> {
    @action
    draw() {
        let { histogram, commonts, title, notation } = this.args 
        let container = select('.bar')
        
        console.log("ready to draw chart");

        histogram.draw(container)
    }
}
