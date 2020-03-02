import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';

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
            .attr("width", 300)
            .attr("heigt", 185.4)
            .selectAll("rect")
            .data(DATASET)
            .enter()
            .append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                return i * RECTHEIGHT
            })
            .attr("width", function (d) {
                return d;
            })
            .attr("height", RECTHEIGHT - 2)
            .attr("fill", "#579AFF");

    }
    @action
    initScale() {
        const dataset = [2.5, 2.1, 1.7, 1.3, 0.9];

        let linear = scaleLinear()
            .domain([0, max(dataset,null)])
            .range([0, 250]);

        const barContainer = select(".scale");

        barContainer
            .attr("width", 300)
            .attr("heigt", 185.4)
            .selectAll("rect")
            .data(dataset,  (d)=> d)
            /**
             * 当svg 内已有元素时，会导致以后的元素不能正确
             * 显示，添加data() 方法的第二个参数可解决。
             * 不过有待进一步深入理解
            */
            .enter()
          .append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                return i * RECTHEIGHT
            })
            .attr("width", function (d) {
                return linear(d);
            })
            .attr("height", RECTHEIGHT - 2)
            .attr("fill", "#C2DAFF");
    }
}
