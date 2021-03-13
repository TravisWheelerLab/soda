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

let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let rectConf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'ann',
    fillColor: (a: soda.Annotation) => colorScale(a.id),
    strokeColor: (a: soda.Annotation) => colorScale(a.id)
};

axis.initialRender(renderParams);
chart.initialRender(renderParams);

soda.rectangleGlyph(chart, ann, rectConf);
