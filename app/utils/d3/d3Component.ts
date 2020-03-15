import Component from '@glimmer/component';
import Layout from './layout';
import axisBuilder from './axis';

interface ID3Component {
    width:number;
    height: number;

}
export default class D3Componnet<Args extends {} = {}> extends Component<ID3Component> {

    width:number = 0;
    height: number = 0;
    constructor(owner:unknown,args:any) {
        super(owner,args)

    }
    public axisBuilder(className:string) {
        const layout = new Layout(className)
    }
}