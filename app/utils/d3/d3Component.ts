import Component from '@glimmer/component';

interface ID3Component {
    width:number;
    height: number;

}
export default class D3Componnet<Args extends {} = {}> extends Component<ID3Component> {

    width:number = 0;
    height: number = 0;
}