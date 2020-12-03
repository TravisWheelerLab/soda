import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

const axis = new soda.AxisChart({selector: '#axis-chart'});
const chart = new soda.TrackChart({selector: '#track-chart'});

const charts = [axis, chart];

const zoomController = new soda.ZoomController();
const resizeController = new soda.ResizeController();

zoomController.addComponents(charts);
resizeController.addComponents(charts);

window.onresize = () => resizeController.trigger();

let n = 500;
let w = 100000;
const ann: soda.Annotation[] = [];
let ids = [];
for (let i = 0; i < n; i++) {
    let id = i.toString();
    ids.push(id);
    ann.push(new soda.Annotation({h: 0, id: id, w: randInt(1000), x: randInt(w), y: 0}));
}

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(ids);

let layerCount = soda.heuristicGraphLayout(ann);
// let colorCount = soda.greedyGraphLayout(ann);

let axisParams: soda.AxisRenderParams = {
    queryEnd: w,
    queryStart: 0
};

let trackParams: soda.TrackChartRenderParams = {
    maxY: layerCount,
    queryEnd: w,
    queryStart: 0
};

axis.render(axisParams);
chart.render(trackParams);

let rectConf = {
    class: 'ann', fillColor: (d: soda.Annotation) => colorScale(d.id)
};

soda.rectangle(chart, ann, rectConf);

function randInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
