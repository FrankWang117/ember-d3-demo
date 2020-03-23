import { Histogram, BarChart, LineChart } from '../index';

class ChartPaint {
    constructor(chart: any) {
        let histogram: Histogram;

        switch (chart.type) {
            case 'bar':
                histogram = new BarChart(chart)
                break;
            case 'line':
                histogram = new LineChart(chart);
                break;
            default:
                histogram = new BarChart(chart)
                break;
        }
        return histogram;
    }
}
export default ChartPaint