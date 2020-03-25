import DS from 'ember-data';

export default class Chart extends DS.Model.extend({
	title: DS.attr('string'),
	type: DS.attr('string'),
	commonts: DS.attr(),  // should be a relationship
	dataset: DS.attr(), // should be a relationship
	dimension: DS.attr(), // same up
	bgColor: DS.attr(),
	colorPool: DS.attr(),
	yAxis: DS.attr(),
	xAxis: DS.attr(),
	pieAxis: DS.attr()
}) {
	// normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
		'chart': Chart;
	}
}
