import Component from '@glimmer/component';
import { action } from '@ember/object';
import Layout from 'ember-d3-demo/utils/d3/layout';

interface D3BpStackArgs {
    width: number;
    height: number;
}

export default class D3BpStack extends Component<D3BpStackArgs> {
    constainer: any = null
    width: number = this.args.width
    height: number = this.args.height
   
    @action
    initChart() {
        let layout = new Layout('.bp-stack')

        let { width, height } = this

        if (width) {
            layout.setWidth(width)
        } else {
            width = layout.getWidth()
        }
        if (height) {
            layout.setHeight(height)
        } else {
            height = layout.getHeight()
        }
        const container = layout.getContainer()
        this.width = layout.getWidth()
        this.height = layout.getHeight()
        this.constainer = container
        // 生成 svg
        let svg = container.append('svg')
            .attr("width", width)
            .attr("height", height);

    }
}
