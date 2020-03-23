export default function () {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */
  this.get('/charts', () => {
    return {
      meta: {
        author: 'frank wang',
        descirption: 'bar option'
      },
      data: [{
        id: "bar-test-2020-03-19",
        type: "charts",
        attributes: {
          title: "This is frist bar chart",
          type: "bar",
          dataset: [
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
          commonts: [
            "first Commont","Second Commont"
          ],
          dimension: ['phase', 'sales', 'quote', 'rate', 'product'],
          bgColor: [0, 0, 0],
          colorPool: [[52, 208, 88]],
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

      }]
    }
  });
  this.get('/charts/:id')
}
