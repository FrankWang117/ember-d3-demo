import Component from '@glimmer/component';
import {Text,Notation,Histogram} from 'ember-d3-demo/utils/diagram/index';
import { action } from '@ember/object';

interface DiagramArgs {
    histogram: Histogram;  // 绘制的图表类型
    commonts:Text[];      // 查看图表的人对图表的评论
    title: Text;        // 图表 title
    notation: Notation  // 图例
}

export default class Diagram extends Component<DiagramArgs> {
    @action
    draw() {
        let {histogram,commonts,title,notation} = this.args
        console.log("ready to draw chart");
        console.log(histogram)
        console.log(title)

    }
}
