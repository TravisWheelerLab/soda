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

let n = 100;
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

let conf = {
    class: 'ann',
    fillColor: (d: soda.Annotation) => colorScale(d.id)
};
let colorCount = soda.heuristicGraphLayout(ann);

let axisParams: soda.AxisRenderParams = {
    queryEnd: w, queryStart: 0
};

let trackParams: soda.TrackChartRenderParams = {
    maxY: colorCount, queryEnd: w, queryStart: 0
};

axis.render(axisParams);
chart.render(trackParams);

soda.rectangle(chart, ann, conf);

for (const a of ann) {
    const hoverConf: soda.HoverConfig<soda.Annotation> = {
        ann : a,
        mouseover: (s, a) => { console.log(a.id, 'hovered') },
        mouseout: (s, a) => { console.log(a.id, "out") }
    };
    soda.addHoverBehavior(hoverConf);

    const tooltipConf: soda.TooltipConfig<soda.Annotation> = {
        ann : a,
        textFromAnn: (a) => a.id,
    };
    soda.tooltip(chart, tooltipConf);

    const clickConf1: soda.ClickConfig<soda.Annotation> = {
        ann : a,
        click: (s, a) => { console.log(a.id, 'clicked') },
    };
    const clickConf2: soda.ClickConfig<soda.Annotation> = {
        ann : a,
        click: (s, a) => { alert(`${a.id} clicked`) },
    };
    soda.addClickBehavior(clickConf1);
    soda.addClickBehavior(clickConf2);

}

function randInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
