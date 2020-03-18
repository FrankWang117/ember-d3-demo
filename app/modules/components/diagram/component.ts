import Component from '@glimmer/component';
import {Text,Notation} from 'ember-d3-demo/utils/diagram/index';

interface DiagramArgs {
    histogram: string;  // 绘制的图表类型
    commonts:Text[];      // 查看图表的人对图表的评论
    title: Text;        // 图表 title
    notation: Notation  // 图例
}

export default class Diagram extends Component<DiagramArgs> {

}
