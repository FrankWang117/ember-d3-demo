
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
			data: [
				{
					id: "bar-test-2020-03-19",
					type: "charts",
					attributes: {
						title: "This is frist bar chart",
						type: "bar",
						dataset: [
							{
								phase: '2018Q1',
								sales: 2200000.25,
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
							"first Commont", "Second Commont"
						],
						dimension: ['phase', 'sales', 'quote', 'rate', 'product'],
						dimensions: ["YEAR", "QUARTER", "MONTH"],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 24,
								right: 24,
								bottom: 24,
								left: 24
							},
							bgColor: 'transparent'
						},
						colorPool: [[52, 208, 88]],
						yAxis: {
							className: 'y-axis',
							position: 'left',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [], // category 必须
							dimension: "SALES_VALUE",
							ticks: 6,
							formatter: 's'
						},
						xAxis: {
							className: 'x-axis',
							position: 'bottom',
							offset: 0,
							type: 'category',
							min: 0,
							max: 0,
							data: [],
							dimension: "YEAR"
						}
					}
				},
				{
					id: "line-test-2020-03-23",
					type: "charts",
					attributes: {
						title: "This is frist line chart",
						type: "line",
						dataset: [[
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
							}]
						],
						commonts: [
							"first Commont", "Second Commont"
						],
						dimension: ['phase', 'sales', 'quote', 'rate', 'product'],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 8,
								right: 8,
								bottom: 8,
								left: 8
							},
							bgColor: 'transparent'
						},
						colorPool: [[52, 208, 88]],
						yAxis: {
							className: 'y-axis',
							position: 'left',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [], // category 必须
							dimension: "sales",
							ticks: 8,
							formatter: '.2s'
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
				},
				{
					id: "pie-test-2020-03-24",
					type: "charts",
					attributes: {
						title: "This is frist pie chart",
						type: "pie",
						dataset: [
							{
								phase: '2018Q1',
								sales: 2200000.25,
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
							"first Commont", "Second Commont"
						],
						dimension: ['phase', 'sales', 'quote', 'rate', 'product'],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 12,
								right: 12,
								bottom: 12,
								left: 12
							},
							bgColor: 'transparent'
						},
						colorPool: [
							[92, 166, 239],
							[195, 221, 65],
							[124, 103, 228],
							[243, 162, 80],
							[72, 207, 234],
							[68, 228, 148],
							[233, 99, 143]
						],
						pieAxis: {
							dimension: 'sales',
							radius: [80, 100],
							hoverOffset: 20,
							center: ['50%', '50%']
						},
						yAxis: {},
						xAxis: {},

					}

				},
				{
					id: "map-test-2020-03-24",
					type: "charts",
					attributes: {
						title: "省份销售数据",
						type: "map",
						dataset: [
							{
								label: '山东省',
								sales: 22000.25,
								quote: 2584466.75,
								rate: "0.8757",
								product: "all"
							},
							{
								label: '广东省',
								sales: 2194822.975,
								quote: 2643496,
								rate: "0.8303",
								product: "all"
							},
							{
								label: '北京市',
								sales: 2359731.25,
								quote: 2770609.75,
								rate: "0.8517",
								product: "all"
							},
							{
								label: '陕西省',
								sales: 2165844.0625,
								quote: 2914783.4375,
								rate: "0.7431",
								product: "all"
							},
							{
								label: '吉林省',
								sales: 704715.671875,
								quote: 2274136,
								rate: "0.3099",
								product: "all"
							},
							{
								label: '广西壮族自治区',
								sales: 677539.40625,
								quote: 2806879,
								rate: "0.2414",
								product: "all"
							},
							{
								label: '内蒙古自治区',
								sales: 679346.203125,
								quote: 2975934,
								rate: "0.2283",
								product: "all"
							}
						],
						commonts: [
							"first Commont", "Second Commont"
						],
						dimension: ['label', 'sales', 'quote', 'rate', 'product'],
						dimensions: ['PROVINCE', "CITY"],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 12,
								right: 12,
								bottom: 12,
								left: 12
							},
							bgColor: 'transparent'
						},
						colorPool: [
							"#E7F0FE", "#B8D4FA", "#8ABCF4", "#5CA6EF",
							"#3492E5",
							"#1E7EC8",
							"#18669A"
						],
						geo: {
							dimension: 'SALES_VALUE',
							center: ['50%', '50%']
						},
						yAxis: {},
						xAxis: {}
					}

				},
				{
					id: "stack-test-2020-03-19",
					type: "charts",
					attributes: {
						title: "苹果橘子还有🍌",
						type: "stack",
						dataset: [
							{ month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, oranges: 400 },
							{ month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, oranges: 400 },
							{ month: new Date(2015, 2, 1), apples: 640, bananas: 960, cherries: 640, oranges: 400 },
							{ month: new Date(2015, 3, 1), apples: 320, bananas: 480, cherries: 640, oranges: 400 }
						],
						commonts: [
							"first Commont", "Second Commont"
						],
						dimension: ['month', 'apples', 'bananas', 'cherries', 'oranges'],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 24,
								right: 24,
								bottom: 24,
								left: 24
							},
							bgColor: 'transparent'
						},
						colorPool: ["#E7F0FE", "#B8D4FA", "#8ABCF4", "#5CA6EF",
							"#3492E5",
							"#1E7EC8",
							"#18669A"],
						yAxis: {
							className: 'y-axis',
							position: 'left',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [], // category 必须
							dimension: ['apples', 'bananas', 'cherries', 'oranges']
						},
						xAxis: {
							className: 'x-axis',
							position: 'bottom',
							offset: 0,
							type: 'time',
							min: 0,
							max: 0,
							data: [],
							dimension: "month"
						}
					}
				},
				{
					id: "scatter-test-2020-03-19",
					type: "charts",
					attributes: {
						title: "泡泡大比拼",
						type: "scatter",
						dataset: [
							{ city: "三峡市", prov_mom: 0.0661353886127472, city_mom: 0.0267854742705822, sales: 1503753.625 },
							{ city: "信阳市", prov_mom: 0.01353886127472, city_mom: 0.021118011325597763, sales: 3141647 },
							{ city: "南阳市", prov_mom: 0.0353886127472, city_mom: 0.009368316270411015, sales: 6627635 },
							{ city: "周口市", prov_mom: 0.053886127472, city_mom: 0.10186182707548141, sales: 3373589 },
							{ city: "商丘市", prov_mom: 0.03886127472, city_mom: 0.07964722067117691, sales: 3416614.75 },
							{ city: "安阳市", prov_mom: 0.0886127472, city_mom: -0.04314463213086128, sales: 2674676.5 },
							{ city: "平山市", prov_mom: 0.086127472, city_mom: -0.058747705072164536, sales: 4709144.5 },
							{ city: "开封市", prov_mom: 0.06127472, city_mom: -0.05621219053864479, sales: 2482781 },
							{ city: "新乡市", prov_mom: 0.0127472, city_mom: -0.03616794943809509, sales: 3960186.75 },
							{ city: "洛阳市", prov_mom: 0.027472, city_mom: -0.033699262887239456, sales: 5285980.5 },
							{ city: "济源市", prov_mom: 0.07472, city_mom: 0.0066471765749156475, sales: 501105.1875 },
							{ city: "漯河市", prov_mom: 0.0472, city_mom: 0.025013713166117668, sales: 1548921.5 },
							{ city: "濮阳市", prov_mom: 0.072, city_mom: 0.01931016333401203, sales: 2402496.75 },
							{ city: "焦作市", prov_mom: 0.61353886127472, city_mom: -0.1028456762433052, sales: 2677141 },
							{ city: "许昌市", prov_mom: 0.1353886127472, city_mom: 0.11013109982013702, sales: 2085245.375 },
							{ city: "驻店市", prov_mom: 0.53886127472, city_mom: 0.1704568713903427, sales: 2854248.25 },
							{ city: "鹤壁市", prov_mom: 0.3886127472, city_mom: 0.0008722419734112918, sales: 754340.875 },
							{ city: "郑州市", prov_mom: 0.886127472, city_mom: 0.2283380776643753, sales: 10153230 }],
						commonts: [
							"first Commont", "Second Commont"
						],
						dimension: ['city', 'prov_mom', 'city_mom', 'sales'],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 24,
								right: 24,
								bottom: 24,
								left: 24
							},
							bgColor: 'transparent'
						},
						colorPool: ["#E7F0FE", "#B8D4FA", "#8ABCF4", "#5CA6EF",
							"#3492E5",
							"#1E7EC8",
							"#18669A"],
						yAxis: {
							className: 'y-axis',
							position: 'left',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [], // category 必须
							dimension: 'city_mom',
							formatter: '%'
						},
						xAxis: {
							className: 'x-axis',
							position: 'bottom',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [],
							dimension: "prov_mom",
							formatter: '%'
						},
						polar: {
							dimension: 'sales'
						}
					}
				},
				{
					id: "scatter-test-2020-04-09",
					type: "charts",
					attributes: {
						title: "地区销售指标与销售额变化",
						type: "scatter",
						commonts: [
							"first Commont", "Second Commont"
						],
						dimension: ['area', 'SALES_QTY', 'SALES_VALUES', 'sales'],
						dimensions: ['PROVINCE','CITY'],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 24,
								right: 24,
								bottom: 24,
								left: 24
							},
							bgColor: 'transparent'
						},
						colorPool: ["#E7F0FE", "#B8D4FA", "#8ABCF4", "#5CA6EF",
							"#3492E5",
							"#1E7EC8",
							"#18669A"],
						yAxis: {
							className: 'y-axis',
							position: 'left',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [], // category 必须
							dimension: 'SALES_VALUE',
							formatter: ''
						},
						xAxis: {
							className: 'x-axis',
							position: 'bottom',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [],
							dimension: "SALES_QTY",
							formatter: ''
						},
						polar: {
							dimension: 'SALES_VALUE'
						}
					}
				},
				{
					id: "stack-test-2020-04-09",
					type: "charts",
					attributes: {
						title: "某市场产品对比",
						type: "stack",
						dataset: [
							{ YEAR: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, oranges: 400 },
							{ YEAR: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, oranges: 400 },
							{ YEAR: new Date(2015, 2, 1), apples: 640, bananas: 960, cherries: 640, oranges: 400 },
							{ YEAR: new Date(2015, 3, 1), apples: 320, bananas: 480, cherries: 640, oranges: 400 }
						],
						commonts: [
							"first Commont", "Second Commont"
						],
						dimension: ['month', 'apples', 'bananas', 'cherries', 'oranges'],
						dimensions: ['YEAR','QUARTER','MONTH'],
						grid: {
							width: "auto",
							height: "auto",
							padding: {
								top: 24,
								right: 24,
								bottom: 24,
								left: 24
							},
							bgColor: 'transparent'
						},
						colorPool: ["#E7F0FE", "#B8D4FA", "#8ABCF4", "#5CA6EF",
							"#3492E5",
							"#1E7EC8",
							"#18669A"],
						yAxis: {
							className: 'y-axis',
							position: 'left',
							offset: 0,
							type: 'value',
							min: 0,
							max: 0,
							data: [], // category 必须
							dimension: ['apples', 'bananas', 'cherries', 'oranges']
						},
						xAxis: {
							className: 'x-axis',
							position: 'bottom',
							offset: 0,
							type: 'time',
							min: 0,
							max: 0,
							data: [],
							dimension: "YEAR"
						}
					}
				},
			]
		}
	});
	this.get('/charts/:id')
	this.passthrough();
	this.passthrough("http://192.168.100.29:3000/**", ["post"]);

}
