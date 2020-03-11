import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import {axisBottom} from 'd3-axis';

interface D3BasicHistogramArgs { }

const DATASET = [250, 210, 170, 130, 90];  //数据（表示矩形的宽度）;
const RECTHEIGHT = 25;   //每个矩形所占的像素高度(包括空白)
const dataset = [2.5, 2.1, 1.7, 1.3, 0.9]; // 数据

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
        let linear = scaleLinear()
            .domain([0, <number>max(dataset)])
            .range([0, 250]);

        const barContainer = select(".scale");

        barContainer
            .attr("width", 300)
            .attr("heigt", 185.4)
            .selectAll("rect")
            .data(dataset)
            .attr("x", 20)
            .attr("y", function (_d, i) {
                return i * RECTHEIGHT
            })
            .attr("width", function (d) {
                return linear(d);
            })
            .attr("height", RECTHEIGHT - 2)
            .attr("fill", "#C2DAFF")
            /**
             * 当svg 内已有元素时，会导致以后的元素不能正确显示
             * 这是因为已经存在的元素，使用 data() 之后，如果数据个数超出
             * 已存在的元素的个数，超出的这部分称之为 enter ，元素与数据对应的
             * 这部分称之为 update。需要对 update 部分以及 enter 部分的元素分别设置
             * 各种 attr，来达到一同展示的目的。
             * 具体解释可以查看 https://wiki.jikexueyuan.com/project/d3wiki/enterexit.html
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
    @action
    initAxes() {
        const linear = scaleLinear()
            .domain([0, max(dataset)])
            .range([0, 250]);

        
        let svgContainer = select(".coordinate");

        svgContainer
            // 样式放入了类中进行控制
            .selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", 20)
            .attr("y", (d, i: number) => i * RECTHEIGHT)
            .attr("width", d => linear(d))
            .attr("height", RECTHEIGHT - 2)
            .attr("fill", "#FFC400");

        const axis = axisBottom(linear)
            .ticks(7);
        
        svgContainer.append("g")
            .attr("class","pb-tm-axis")
            .attr("transform","translate(20,130)").call(axis)

    }
}
