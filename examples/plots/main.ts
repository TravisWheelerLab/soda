import * as soda from "@traviswheelerlab/soda"

let gcData = [
    40, 40, 40, 60, 60, 60, 60, 40, 40, 40, 60, 60, 40, 60, 60, 40, 40, 40, 60, 60, 60, 40, 20, 60, 60, 40, 40, 40, 60,
    40, 60, 60, 40, 60, 60, 20, 40, 80, 60, 40, 40, 40, 60, 60, 60, 40, 60, 60, 60, 60, 40, 60, 40, 40, 60, 60, 60, 40,
    40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 80, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60,
    40, 40, 40, 60, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60,
    60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40,
    60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40,
    40, 60, 60, 60, 40, 40, 40, 60, 60, 60, 40, 40, 40, 100, 40, 40, 60, 60, 60, 40, 40, 40, 60, 60, 60]

let axis = new soda.AxisChart({selector: '#axis-chart'});
let lineChart = new soda.LineChart({selector: '#line-chart', binHeight:100});
let barChart = new soda.BarChart({selector: '#bar-chart', binHeight:100});
let heatmapChart = new soda.HeatmapChart({selector: '#heatmap-chart', binHeight:20});

let charts = [axis, lineChart, barChart, heatmapChart]

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponents(charts)
resizeController.addComponents(charts)

window.onresize = () => resizeController.trigger();

let conf: soda.PlotAnnotationConfig = {
    id: `0`,
    x: 0,
    w: 1000,
    y: 0,
    points: gcData,
}

let ann = new soda.PlotAnnotation(conf)

let renderParams: soda.LineChartRenderParams = {
    data: ann,
    queryStart: 0,
    queryEnd: 1000,
    maxY: 1
};

axis.initialRender(renderParams);
lineChart.initialRender(renderParams);
barChart.initialRender(renderParams);
heatmapChart.initialRender(renderParams);
