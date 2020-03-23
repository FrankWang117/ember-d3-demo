import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
    data() {
        return [
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
          ]
    },
    dimension() {
        return ['phase', 'sales', 'quote', 'rate', 'product']
    },
    bgColor() {
        return [0,0,0]
    },
    color() {
        return [52,208,88]
    },
    yAxis() {
        return {
            className: 'y-axis',
            position: 'left',
            offset: 0,
            type: 'value',
            min: 0,
            max: 0,
            data: [], // category 必须
            dimension: "sales"
          }
    },
    xAxis() {
        return {
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
});
