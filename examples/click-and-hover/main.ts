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

let ann: soda.Annotation[] = [];
for (let i = 0; i < 10; i++) {
    let annConf: soda.AnnotationConfig = {
        id: `${i}`,
        w: 100,
        x: i * 100,
        y: i,
    };
    ann.push(new soda.Annotation(annConf));
}

let renderParams: soda.TrackChartRenderParams = {
    queryStart: 0,
    queryEnd: 1000,
    maxY: 10
};

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)

let conf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'ann',
    fillColor: (d: soda.Annotation) => colorScale(d.id),
    strokeColor: (d: soda.Annotation) => colorScale(d.id)
};

axis.initialRender(renderParams);
chart.initialRender(renderParams);

soda.rectangleGlyph(chart, ann, conf);

let hoverConf: soda.HoverConfig<soda.Annotation> = {
    mouseover: (s, a) => { console.log(`${a.id} hovered`) },
    mouseout: (s, a) => { console.log(`${a.id} out`) }
};
soda.hoverBehavior(ann, hoverConf);

let tooltipConf: soda.TooltipConfig<soda.Annotation, soda.TrackChart<any>> = {
    text: (a) => a.id,
};
soda.tooltip(chart, ann, tooltipConf);

let clickConf1: soda.ClickConfig<soda.Annotation> = {
    click: (s, a) => { console.log(`${a.id} clicked`) },
};

let clickConf2: soda.ClickConfig<soda.Annotation> = {
    click: (s, a) => { alert(`${a.id} clicked`) },
};

soda.clickBehavior(ann, clickConf1);
soda.clickBehavior(ann, clickConf2);
