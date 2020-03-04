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
      ]
    })
  }
}) {

  // normal class body definition here
}
