import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

let axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.TrackChart({selector: '#track-chart'});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

let n = 100;
let w = 100000;

let ann: soda.Annotation[] = [];

let ids = [];
for (let i = 0; i < n; i++) {
    let id = i.toString();
    ids.push(id);
    ann.push(new soda.Annotation({id: id, w: randInt(1000), x: randInt(w), y: 0}));
}

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(ids);

let conf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'ann',
    fillColor: (d: soda.Annotation) => colorScale(d.id)
};
let colorCount = soda.heuristicGraphLayout(ann);

let axisParams: soda.AxisRenderParams = {
    queryEnd: w, queryStart: 0
};

let trackParams: soda.TrackChartRenderParams = {
    maxY: colorCount, queryEnd: w, queryStart: 0
};

axis.initialRender(axisParams);
chart.initialRender(trackParams);

soda.rectangleGlyph(chart, ann, conf);

let hoverConf: soda.HoverConfig<soda.Annotation> = {
    mouseover: (s, a) => { console.log(a.id, 'hovered') },
    mouseout: (s, a) => { console.log(a.id, "out") }
};
soda.hoverBehavior(ann, hoverConf);

let tooltipConf: soda.TooltipConfig<soda.Annotation, soda.TrackChart<any>> = {
    text: (a) => a.id,
};
soda.tooltip(chart, ann, tooltipConf);

let clickConf1: soda.ClickConfig<soda.Annotation> = {
    click: (s, a) => { console.log(a.id, 'clicked') },
};
let clickConf2: soda.ClickConfig<soda.Annotation> = {
    click: (s, a) => { alert(`${a.id} clicked`) },
};

soda.clickBehavior(ann, clickConf1);
soda.clickBehavior(ann, clickConf2);

function randInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
