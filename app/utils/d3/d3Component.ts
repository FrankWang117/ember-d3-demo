import Component from '@glimmer/component';

interface ID3Component {
    width:number;
    height: number;

}
export default class D3Componnet extends Component<ID3Component> {

    width:number = 0;
    height: number = 0;
    constructor(owner:unknown,args:any) {
        super(owner,args)

    }
    public axisBuilder() {
    }
}