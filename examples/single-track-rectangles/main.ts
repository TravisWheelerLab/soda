import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

const axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.TrackChart({selector: '#track-chart'});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

let n = 10;
let w = 1000;
const ann: soda.Annotation[] = [];
let ids = [];
for (let i = 0; i < n; i++) {
    let id = i.toString();
    ids.push(id);
    ann.push(new soda.Annotation({h: 0, id: id, w: (w/n), x: i * (w/n), y: i}));
}

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(ids);

let axisParams: soda.AxisRenderParams = {
    queryEnd: w, queryStart: 0
};

let trackParams: soda.TrackChartRenderParams = {
    maxY: n, queryEnd: w, queryStart: 0
};

axis.render(axisParams);
chart.render(trackParams);

let rectConf = {
    class: 'ann', fillColor: (d: soda.Annotation) => colorScale(d.id)
};

soda.rectangle(chart, ann, rectConf);
