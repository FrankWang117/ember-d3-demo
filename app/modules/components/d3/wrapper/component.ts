import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
interface D3WrapperArgs {
	model: any
}

export default class D3Wrapper extends Component<D3WrapperArgs> {
	private menuList: any[] = [
		{ name: 'Hello', identify: 'hello', comp: "d3/hello-wrold" },
		{ name: 'Bind Data', identify: 'bind' },
		{ name: 'Basic Histogram', identify: "histo", comp: "d3/basic-histogram" },
		{ name: "Bar", identify: "bar", comp: "d3/bp-bar" },
		{ name: "Layout&Pie", identify: "pie", comp: "d3/bp-pie" },
		{ name: "Line Demo", identify: "line", comp: "d3/bp-line" },
		{ name: "Lines Demo", identify: "lines", comp: "d3/bp-multi-lines" },
		{ name: "China Map", identify: "map", comp: "d3/bp-map" }
	]
	@tracked pieData: any[] = this.args.model.pieData
	@tracked navTitle: string = "hello"
	get pieResult() {
		return this.pieData
	}
	@action
	changeNav(nav: string) {
		this.navTitle = nav
	}
	@action
	changePie() {
		console.log("changePie")
		let random = () => Math.random() * 100
		this.pieData = [
			["癫痫竞品1", random(), null, "0.1952"],
			["开浦兰", random(), null, "0.0515"],
			["癫痫竞品2", random(), null, "0.0212"],
			["维派特", random(), null, "0.0000"],
			["其他竞品", random(), null, "0.7322"]
		]
	}
	@action
	changePieCount() {
		let len = () => Math.random() * 10 + 3
		let random = () => Math.random() * 100
		let data = []
		for(let i = 0,l = len();i<l;i++) {
			data.push(["癫痫竞品"+i, random(), null, "0.1952"])
		}
		this.pieData = data
	}
}
