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
    ]
    })
  }
}) {

  // normal class body definition here
}
