import Component from '@glimmer/component';
import { action } from '@ember/object';
import {select } from 'd3-selection';

interface D3BasicShapeArgs {}

export default class D3BasicShape extends Component<D3BasicShapeArgs> {
    @action
    initRect() {
        let container = select(".b-rect");
        let rectSvg = container.append('svg')
            .attr('width',100)
            .attr('height',100)
            .style('background-color','#fafbfc');
        
            rectSvg.append('rect')
                .attr('x',10)
                .attr('y',10)
                .attr('width',24)
                .attr('height',80)
                .attr('fill','lightblue')
    }
    @action 
    initLine() {
        let container = select(".b-line");
        let rectSvg = container.append('svg')
            .attr('width',100)
            .attr('height',100)
            .style('background-color','white');
        
            rectSvg.append('line')
                .attr('x1',10)
                .attr('y1',10)
                .attr('x2',60)
                .attr('y2',60)
                .attr('stroke',"lightblue")
                .attr('stroke-width',4)
    }
    @action
    initCircle() {
        let container = select(".b-circle");
        let rectSvg = container.append('svg')
            .attr('width',100)
            .attr('height',100)
            .style('background-color','#fafbfc');
        
            rectSvg.append('circle')
                .attr('cx',50)
                .attr('cy',50)
                .attr('r',25)
                .attr('fill',"lightblue")
    }
    @action
    initEllipse() {
        let container = select(".b-ellipse");
        let rectSvg = container.append('svg')
            .attr('width',100)
            .attr('height',100)
            .style('background-color','#fafbfc');
        
            rectSvg.append('ellipse')
                .attr('cx',50)
                .attr('cy',50)
                .attr('rx',30)
                .attr('ry',20)
                .attr('fill',"lightblue")
    }
    @action
    initPoly() {
        let container = select(".b-poly");
        let rectSvg = container.append('svg')
            .attr('width',100)
            .attr('height',100)
            .style('background-color','#fafbfc');
        
            rectSvg.append('polyline')
                .attr('points',"05,30 15,30 15,20 25,20 25,10 35,10")
                .attr('stroke-width',4)
                .attr('stroke',"lightblue")
                .attr('fill',"none");
            rectSvg.append('polygon')
                .attr('points',"80,80 100,80 100,100 80,100")
                .attr('stroke-width',4)
                .attr('stroke',"lightblue")
                .attr('fill',"lightgreen")
    }
}
