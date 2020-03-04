import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
interface D3WrapperArgs {
    model:any
}

export default class D3Wrapper extends Component<D3WrapperArgs> {
    @tracked pieData: any[] = this.args.model.pieData
    get pieResult() {
        return this.pieData
    }
    @action
    changePie() {
        console.log(this.args.model)
        let random = ()=> Math.random() * 100
        this.pieData = [
        ["癫痫竞品1", random(), null, "0.1952"],
        ["开浦兰", random(), null, "0.0515"],
        ["癫痫竞品2", random(), null, "0.0212"],
        ["维派特", random(), null, "0.0000"],
        ["其他竞品", random(), null, "0.7322"]
        ]
    }
}
