import Component from '@glimmer/component';
import { Histogram, Notation, Text }
    from 'ember-d3-demo/utils/diagram/index';
import { action } from '@ember/object';
import { select } from 'd3-selection';

interface DiagramArgs {
    chart: any
    histogram: Histogram;  // 绘制的图表类型
    commonts: Text[];      // 查看图表的人对图表的评论
    title: Text;        // 图表 title
    notation: Notation  // 图例
}

export default class Diagram extends Component<DiagramArgs> {
    @action
    draw() {
        let { histogram } = this.args
        let container = select(`#${this.args.chart.id}`),
            comp = '信立泰',
            prov = '广东',
            prod = '波立维片剂75MG7赛诺菲-安万特制药有限公司',
            year = 2019,
            quarter = 1,
            month = 1;

        console.log("ready to draw chart");
        // 必须在draw 执行之前重设 updateData 的方法
        console.log(histogram.constructor.name)
        let chartType = histogram.constructor.name;
        switch (chartType) {
            case 'BarChart':
                histogram.updateData = function (fsm: any, dimensions: string[]) {
                    return new Promise((resolve) => {
                        let state = fsm.state,
                            sqlDimensions = dimensions.map(item => {
                                if (fsm[item]) {
                                    return `AND ${item}.keyword = '${fsm[item]}'`
                                }
                                return ''
                            })
                        // TODO 内部具体动作应该提出到组件或者路由中操作

                        resolve(fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "sql": `SELECT ${state}, PRODUCT_NAME, SALES_VALUE FROM fullcube2 WHERE DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-PROVINCE-PRODUCT_NAME' ${sqlDimensions.join(" ")} AND COMPANY = '${comp}' AND PROVINCE = '${prov}' AND PRODUCT_NAME.keyword = '${prod}'  ORDER BY ${state}.keyword` }),
                        }))
                    }).then((result: any) => {
                        return result.json();
                    }).then(data => {
                        return data
                    })
                }
                break;
            case 'MapChart':
            case 'ScatterChart':
                histogram.updateData = function (fsm: any, dimensions: string[]) {
                    return new Promise((resolve) => {
                        console.log(fsm.state)
                        let state = fsm.state,
                            sqlDimensions = dimensions.map(item => {
                                if (fsm[item]) {
                                    return `AND ${item}.keyword = '${fsm[item]}'`
                                }
                                return ''
                            })
                        // TODO 内部具体动作应该提出到组件或者路由中操作
                        if (state == "PROVINCE") {
                            resolve(fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ "sql": `SELECT ${state}, SALES_VALUE, SALES_QTY FROM fullcube2 WHERE MKT IN (SELECT MKT FROM fullcube2 WHERE DIMENSION_NAME.keyword = '2-time-prod' AND DIMENSION_VALUE.keyword = 'MONTH-PRODUCT_NAME' AND COMPANY.keyword = '${comp}' AND YEAR = ${year} AND QUARTER = ${quarter} AND MONTH = ${month} AND PRODUCT_NAME = '${prod}') AND DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = 'MONTH-${state}-MKT' AND COMPANY.keyword = '${comp}' AND YEAR = ${year} AND QUARTER = ${quarter} AND MONTH = ${month} AND COUNTRY.keyword = 'CHINA'` }),
                            }))
                        } else if (state === 'CITY') {
                            console.log(fsm[dimensions[0]])
                            let prov = fsm[dimensions[0]]
                            resolve(fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ "sql": `SELECT ${state}, SALES_VALUE, SALES_QTY FROM fullcube2 WHERE MKT IN (SELECT MKT FROM fullcube2 WHERE DIMENSION_NAME.keyword = '2-time-prod' AND DIMENSION_VALUE.keyword = 'MONTH-PRODUCT_NAME' AND COMPANY.keyword = '${comp}' AND YEAR = ${year} AND QUARTER = ${quarter} AND MONTH = ${month} AND PRODUCT_NAME = '${prod}') AND DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = 'MONTH-${state}-MKT' AND COMPANY.keyword = '${comp}' AND YEAR = ${year} AND QUARTER = ${quarter} AND MONTH = ${month} AND PROVINCE.keyword like '${prov}%'` }),
                            }))
                        }
                    }).then((result: any) => {
                        return result.json();
                    }).then(data => {
                        console.log(data)
                        return data
                    })
                }
                break;
            case 'StackChart':
                // histogram.updateData = function (fsm: any, dimensions: string[]) {
                //     return new Promise((resolve) => {
                //         let state = fsm.state,
                //             sqlDimensions = dimensions.map(item => {
                //                 if (fsm[item]) {
                //                     return `AND ${item}.keyword = '${fsm[item]}'`
                //                 }
                //                 return ''
                //             })
                //         // TODO 内部具体动作应该提出到组件或者路由中操作

                //         resolve(fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json'
                //             },
                //             body: JSON.stringify({ "sql": `SELECT ${state}, PRODUCT_NAME, SALES_VALUE FROM fullcube2 WHERE DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-PROVINCE-PRODUCT_NAME' ${sqlDimensions.join(" ")} AND COMPANY = '${comp}' AND PROVINCE = '${prov}' AND PRODUCT_NAME.keyword = '${prod}'  ORDER BY ${state}.keyword` }),
                //         }))
                //     }).then((result: any) => {
                //         return result.json();
                //     }).then(data => {
                //         return data
                //     })
                // }
                break;
            default:
                break;
        }

        histogram.draw(container)
    }
}
