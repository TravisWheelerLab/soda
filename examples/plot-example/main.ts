import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

let gcData = [
40,
40,
40,
60,
60,
60,
60,
40,
40,
40,
60,
60,
40,
60,
60,
40,
40,
40,
60,
60,
60,
40,
20,
60,
60,
40,
40,
40,
60,
40,
60,
60,
40,
60,
60,
20,
40,
80,
60,
40,
40,
40,
60,
60,
60,
40,
60,
60,
60,
60,
40,
60,
40,
40,
60,
60,
60,
40,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
80,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60,
40,
40,
40,
100,
40,
40,
60,
60,
60,
40,
40,
40,
60,
60,
60]

// gcData = gcData.slice(0,20);
const axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.LineChart({selector: '#track-chart', binHeight:100});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let ann: soda.PlotAnnotation[] = []
for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
        let conf: soda.PlotAnnotationConfig = {
            id: `i`,
            x: i * 1000,
            w: 1000,
            y: j,
            h: 0,
            values: gcData,
        }
        ann.push(new soda.PlotAnnotation(conf))
    }
}

let renderParams: soda.LineChartRenderParams = {
    data: ann,
    queryStart: 0,
    queryEnd: 1000,
    maxY: 11
};

axis.render(renderParams);
chart.render(renderParams);
