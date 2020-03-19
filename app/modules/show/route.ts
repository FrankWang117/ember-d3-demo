import Route from '@ember/routing/route';
import { BarChart, Notation, Text, } from 'ember-d3-demo/utils/diagram/index'
import { hash } from 'rsvp';

export default class Show extends Route.extend({
  // anything which *must* be merged to prototype here
  model() {
    let options = {
      data: [
        {
          phase: '2018Q1',
          sales: 2263262.25,
          quote: 2584466.75,
          rate: "0.8757",
          product: "all"
        },
        {
          phase: '2018Q2',
          sales: 2194822.96875,
          quote: 2643496,
          rate: "0.8303",
          product: "all"
        },
        {
          phase: '2018Q3',
          sales: 2359731.25,
          quote: 2770609.75,
          rate: "0.8517",
          product: "all"
        },
        {
          phase: '2018Q4',
          sales: 2165844.0625,
          quote: 2914783.4375,
          rate: "0.7431",
          product: "all"
        },
        {
          phase: '2019Q1',
          sales: 704715.671875,
          quote: 2274136,
          rate: "0.3099",
          product: "all"
        },
        {
          phase: '2019Q2',
          sales: 677539.40625,
          quote: 2806879,
          rate: "0.2414",
          product: "all"
        },
        {
          phase: '2019Q3',
          sales: 679346.203125,
          quote: 2975934,
          rate: "0.2283",
          product: "all"
        }
      ],
      dimension: ['phase', 'sales', 'quote', 'rate', 'product'],
      bgColor: [0,0,0],
      color: [52,208,88],
      yAxis: {
        className: 'y-axis',
        position: 'left',
        offset: 0,
        type: 'value',
        min: 0,
        max: 0,
        data: [], // category 必须
        dimension: "sales"
      },
      xAxis: {
        className: 'x-axis',
        position: 'bottom',
        offset: 0,
        type: 'category',
        min: 0,
        max: 0,
        data: [],
        dimension: "phase"
      }
    }
    let histogram = new BarChart(options);
    let commonts: Text[] = [
      new Text("this is first comment")
    ];
    let title: Text = new Text('Test BarChart Title');
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
