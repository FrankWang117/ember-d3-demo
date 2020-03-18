import Route from '@ember/routing/route';
import {Histogram,Text,Notation} from 'ember-d3-demo/utils/diagram/index'
import { hash } from 'rsvp';

export default class Show extends Route.extend({
  // anything which *must* be merged to prototype here
  model() {
    let histogram = new Histogram();
    let commonts: Text[] = [];
    let title: Text = new Text('test');
    let notation: Notation = new Notation();
    return hash({
      histogram,
      commonts,
      title,
      notation
    })
  }
}) {
  // normal class body definition here
}
