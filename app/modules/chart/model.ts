import DS from 'ember-data';

export default class Chart extends DS.Model.extend({
	bgColor: DS.attr(),
	colorPool: DS.attr(),
	commonts: DS.attr(),  // should be a relationship
	dataset: DS.attr(), // should be a relationship
	dimension: DS.attr(), // same up
	// 以下用于设置drilldown / scrollup 操作
	dimensions: DS.attr(),
	measures: DS.attr(),
	// 地图坐标系
	geo: DS.attr(),
	grid: DS.attr(),
	pieAxis: DS.attr(),
	// 极坐标轴
	polar: DS.attr(),
	title: DS.attr('string'),
	type: DS.attr('string'),
	xAxis: DS.attr(),
	yAxis: DS.attr(),
}) {
	// normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
		'chart': Chart;
	}
}
