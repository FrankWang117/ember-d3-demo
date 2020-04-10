import Component from '@glimmer/component';
import { Histogram, Notation, Text }
    from 'ember-d3-demo/utils/diagram/index';
import { action } from '@ember/object';
import { select } from 'd3-selection';
import { all,resolve } from 'rsvp';

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
        let chartId = histogram.option.id;
        switch (chartId) {
            case 'bar-test-2020-03-19':
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
            case 'map-test-2020-03-24':
            case 'scatter-test-2020-04-09':
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
                        if (state == "PROVINCE") {
                            resolve(fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ "sql": `SELECT ${state}, SALES_VALUE, SALES_QTY FROM fullcube2 WHERE MKT IN (SELECT MKT FROM fullcube2 WHERE DIMENSION_NAME.keyword = '2-time-prod' AND DIMENSION_VALUE.keyword = 'MONTH-PRODUCT_NAME' AND COMPANY.keyword = '${comp}' AND YEAR = ${year} AND QUARTER = ${quarter} AND MONTH = ${month} AND PRODUCT_NAME = '${prod}') AND DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = 'MONTH-${state}-MKT' AND COMPANY.keyword = '${comp}' AND YEAR = ${year} AND QUARTER = ${quarter} AND MONTH = ${month} AND COUNTRY.keyword = 'CHINA'` }),
                            }))
                        } else if (state === 'CITY') {
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
                        return data;
                    })
                }
                break;
            case 'stack-test-2020-04-09':
                histogram.updateData = function (fsm: any, dimensions: string[]) {
                    let state = fsm.state,
                        sqlDimensions = dimensions.map(item => {
                            if (fsm[item]) {
                                return `AND ${item}.keyword = '${fsm[item]}'`
                            }
                            return ''
                        })
                    return all([
                        fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "sql": `SELECT ${state}, PRODUCT_NAME, SALES_VALUE, SALES_QTY FROM fullcube2 WHERE DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-PROVINCE-PRODUCT_NAME' AND COMPANY = '${comp}' AND PROVINCE = '${prov}' AND PRODUCT_NAME.keyword = '${prod}' ${sqlDimensions.join(" ")} ORDER BY ${state}.keyword` }),
                        }),
                        fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "sql": `SELECT ${state}, MKT, SALES_VALUE, SALES_QTY FROM fullcube2 WHERE MKT IN (SELECT MKT FROM fullcube2 WHERE DIMENSION_NAME.keyword = '2-time-prod' AND DIMENSION_VALUE.keyword = 'MONTH-PRODUCT_NAME' AND COMPANY = '信立泰' AND YEAR = 2019 AND QUARTER = 1 AND MONTH = 1 AND PRODUCT_NAME.keyword = '波立维片剂75MG7赛诺菲-安万特制药有限公司') AND DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-COUNTRY-MKT' AND COMPANY.keyword = '${comp}' AND COUNTRY.keyword = 'CHINA' ${sqlDimensions.join(" ")} ORDER BY ${state}.keyword` }),
                        })
                    ]).then((result: any) => {
                        return all(result.map((res: any) => {
                            return res.json()
                        }))
                    }).then((data: any[]) => {
                        let time = data[0].map((item: any) => {
                            return {
                                [fsm.state]: item[fsm.state]
                            }
                        }),
                            result = time.reduce((acc: any, cur: any, i: number) => {
                                cur['其他产品'] = data[1][i]['SALES_VALUE'] - data[0][i]['SALES_VALUE']
                                cur[data[0][i]['PRODUCT_NAME']] = data[0][i]['SALES_VALUE']

                                return acc;
                            }, time)
                        return result
                    })
                }
                break;
            case 'stack-test-2020-04-10-mulit':
                histogram.updateData = function (fsm: any, dimensions: string[]) {
                    let state = fsm.state,
                        sqlDimensions = dimensions.map(item => {
                            if (fsm[item]) {
                                return `AND ${item}.keyword = '${fsm[item]}'`
                            }
                            return ''
                        })
                    return fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "sql": `SELECT ${state}, MOLE_NAME, SUM(SALES_VALUE) AS SALES_VALUE FROM fullcube2 WHERE DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-PROVINCE-MOLE_NAME' AND COMPANY = '${comp}' AND PROVINCE = '${prov}' AND MKT IN (SELECT MKT FROM fullcube2 WHERE DIMENSION_NAME.keyword = '2-time-prod' AND DIMENSION_VALUE.keyword = 'MONTH-PRODUCT_NAME' AND COMPANY.keyword = '信立泰' AND YEAR = 2019 AND QUARTER = 1 AND MONTH = 1 AND PRODUCT_NAME = '介宁片剂50MG36山东新华医药集团有限责任公司') GROUP BY ${state}.keyword, MOLE_NAME.keyword ORDER BY ${state}.keyword` }),
                    }).then((result: any) => {
                        return result.json()
                    }).then((data: any[]) => {
                        let timeStr = [...new Set(data.map((item: any) => item[fsm.state]))],
                            time = timeStr.map((item: any) => {
                                return {
                                    [fsm.state]: item
                                }
                            }),
                            result = time.reduce((acc: any, cur: any, i: number) => {
                                let state = fsm.state,
                                    curTimeData = data.filter((item: any) => item[state] === cur[state]);

                                curTimeData.forEach((item: any) => {
                                    cur[item['MOLE_NAME']] = item['SALES_VALUE']
                                })

                                return acc;
                            }, time);
                        return result
                    })
                }
                break;
            case 'lines-test-2020-04-10':
                histogram.updateData = function (fsm: any, dimensions: string[]) {
                    let state = fsm.state,
                        sqlDimensions = dimensions.map(item => {
                            if (fsm[item]) {
                                return `AND ${item}.keyword = '${fsm[item]}'`
                            }
                            return ''
                        })
                    return all([
                        fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "sql": `SELECT ${state}, PRODUCT_NAME, SALES_VALUE, SALES_QTY FROM fullcube2 WHERE DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-PROVINCE-PRODUCT_NAME' AND COMPANY = '${comp}' AND PROVINCE = '${prov}' AND PRODUCT_NAME.keyword = '${prod}' ${sqlDimensions.join(" ")} ORDER BY ${state}.keyword` }),
                        }),
                        fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "sql": `SELECT ${state}, MKT, SALES_VALUE, SALES_QTY FROM fullcube2 WHERE MKT IN (SELECT MKT FROM fullcube2 WHERE DIMENSION_NAME.keyword = '2-time-prod' AND DIMENSION_VALUE.keyword = 'MONTH-PRODUCT_NAME' AND COMPANY = '信立泰' AND YEAR = 2019 AND QUARTER = 1 AND MONTH = 1 AND PRODUCT_NAME.keyword = '波立维片剂75MG7赛诺菲-安万特制药有限公司') AND DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-COUNTRY-MKT' AND COMPANY.keyword = '${comp}' AND COUNTRY.keyword = 'CHINA' ${sqlDimensions.join(" ")} ORDER BY ${state}.keyword` }),
                        })
                    ]).then((result: any) => {
                        return all(result.map((res: any) => {
                            return res.json()
                        }))
                    }).then((data: any[]) => {
                        // let otherProds = data[1].map((item: any) => {
                        //     return {
                        //         PRODUCT_NAME: '其他产品',
                        //         ...item
                        //     }
                        // });

                        return data;
                    })
                }
                break;
                case 'lines-test-2020-04-10-import-product':
                histogram.updateData = function (fsm: any, dimensions: string[]) {
                    let state = fsm.state,
                        sqlDimensions = dimensions.map(item => {
                            if (fsm[item]) {
                                return `AND ${item}.keyword = '${fsm[item]}'`
                            }
                            return ''
                        })
                        return resolve(fetch("http://192.168.100.29:3000/sql?tag=array", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "sql": `SELECT PRODUCT_NAME FROM fullcube2 WHERE MKT IN (SELECT MKT FROM fullcube2 WHERE DIMENSION_NAME.keyword = '2-time-prod' AND DIMENSION_VALUE.keyword = 'MONTH-PRODUCT_NAME' AND COMPANY = '信立泰' AND YEAR = 2019 AND QUARTER = 1 AND MONTH = 1 AND PRODUCT_NAME.keyword = '波立维片剂75MG7赛诺菲-安万特制药有限公司') AND DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = 'QUARTER-COUNTRY-PRODUCT_NAME' AND COMPANY.keyword = '信立泰' AND YEAR = 2019 AND QUARTER = 1 AND COUNTRY.keyword = 'CHINA' ORDER BY SALES_VALUE DESC LIMIT 10` }),
                        })).then((data:any)=> {
                            return data.json()
                        }).then((data:any)=> {
                            if(data.includes(prod)) {
                                data.splice(data.indexOf(prod),1)
                            }
                            data.unshift(prod)
                            return all(data.map((curProd:string)=> {
                                return fetch("http://192.168.100.29:3000/sql?tag=listMap", {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ "sql": `SELECT ${state}, PRODUCT_NAME, SALES_VALUE FROM fullcube2 WHERE DIMENSION_NAME.keyword = '3-time-geo-prod' AND DIMENSION_VALUE.keyword = '${state}-PROVINCE-PRODUCT_NAME' AND COMPANY = '${comp}' AND PROVINCE = '${prov}' AND PRODUCT_NAME.keyword = '${curProd}' ${sqlDimensions.join(" ")} ORDER BY YEAR.keyword` }),
                                })
                            }))
                        }).then((result: any) => {
                        return all(result.map((res: any) => {
                            return res.json()
                        }))
                    }).then((data: any[]) => {
                        return data
                    })
                }
                break;
            default:
                break;
        }

        histogram.draw(container)
    }
}