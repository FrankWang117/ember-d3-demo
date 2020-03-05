import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class D3 extends Route.extend({
  // anything which *must* be merged to prototype here
  model() {
    return hash({
      pieData: [
        ["癫痫竞品1", 2575385.5, null, "0.1952"],
        ["开浦兰", 679346.1875, null, "0.0515"],
        ["癫痫竞品2", 279866.65625, null, "0.0212"],
        ["维派特", 0, null, "0.0000"],
        ["其他竞品", 9662320.65625, null, "0.7322"]
      ],
      barData: [
        ['2018Q1', 2263262.25, 2584466.75, "0.8757", "all", null],
        ['2018Q2', 2194822.96875, 2643496, "0.8303", "all", null],
        ['2018Q3', 2359731.25, 2770609.75, "0.8517", "all", null],
        ['2018Q4', 2165844.0625, 2914783.4375, "0.7431", "all", null],
        ['2019Q1', 704715.671875, 2274136, "0.3099", "all", null],
        ['2019Q2', 677539.40625, 2806879, "0.2414", "all", null],
        ['2019Q3', 679346.203125, 2975934, "0.2283", "all", null]
      ],
      multiLineData: [[
            {label:'2018-01', name:"开浦兰",value:0.715,count: 2300, other:0.0000},
            {label:'2018-04', name:"开浦兰",value:0.663,count: 2400, other:0.0000},
            {label:'2018-07', name:"开浦兰",value:0.18,count: 2300, other:0.0000},
            {label:'2018-10', name:"开浦兰",value:0.3788,count: 2300, other:0.0000}
        ],
        [
            {label:'2018-01', name:"癫痫竞品1",value:0.15,count: 2100, other:0.0000},
            {label:'2018-04', name:"癫痫竞品1",value:0.63,count: 2400, other:0.0000},
            {label:'2018-07', name:"癫痫竞品1",value:0.18,count: 200, other:0.0000},
            {label:'2018-10', name:"癫痫竞品1",value:0.78,count: 300, other:0.0000}
        ],
        [
            {label:'2018-01', name:"维派特",value:0.5,count: 100, other:0.0000},
            {label:'2018-04', name:"维派特",value:0.3,count: 400, other:0.0000},
            {label:'2018-07', name:"维派特",value:0.1,count: 2500, other:0.0000},
            {label:'2018-10', name:"维派特",value:0.7,count: 3100, other:0.0000}
        ]]
    })
  }
}) {

  // normal class body definition here
}
