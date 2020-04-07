import Route from '@ember/routing/route';
import { ChartPaint, Notation, Text, } from 'ember-d3-demo/utils/diagram/index'
// import { hash } from 'rsvp';

export default class Show extends Route.extend({
	// anything which *must* be merged to prototype here
	model() {
		return this.store.findAll('chart')
			.then( data => {
				let charts = data.map(chart => {
					return {
						chart,
						histogram: new ChartPaint(chart),
						title: new Text((chart.title as unknown)as string),
						commonts: ((chart.commonts as unknown) as any[]).map((com: string) => {
							return new Text(com)
						}),
						notation: new Notation()
					}
				})
				return charts
			})
	}
}) {
	// normal class body definition here
}
