import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';

interface D3BasicHistogramArgs { }

const DATASET = [250, 210, 170, 130, 90];  //数据（表示矩形的宽度）;
const RECTHEIGHT = 25;   //每个矩形所占的像素高度(包括空白)
export default class D3BasicHistogram extends Component<D3BasicHistogramArgs> {
    @action
    appendSvg() {
        let container = select(".basic-svg-container");
        container.append('svg')
            .attr("width", 300)
            .attr("height", 185.4)
            .style("background-color", "orange")
    }

    @action
    initHistogram() {
        const barContainer = select(".bar-container");

        barContainer
            .attr("width",300)
            .attr("heigt",185.4)
            .selectAll("rect")
            .data(DATASET,function(d) {
                return d
            })
            .enter()
            .append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                console.log(i)
                return i * RECTHEIGHT
            })
            .attr("width", function (d) {
                return d;
            })
            .attr("height", RECTHEIGHT - 2)
            .attr("fill", "#579AFF")

    }
}
