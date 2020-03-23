import {Histogram,BarChart} from '../index';

class ChartPaint {
    constructor(chart: any) {
        let histogram: Histogram;

        switch (chart.type) {
            case 'bar':
                histogram = new BarChart(chart)
                break;

            default:
                histogram = new BarChart(chart)
                break;
        }
        return histogram;
    }
}
export default ChartPaint