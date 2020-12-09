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
let exampleWidth = 1000;
const ann: soda.Annotation[] = [];
for (let i = 0; i < n; i++) {
    let id = i.toString();
    let annConf: soda.AnnotationConfig = {
        id: id,
        w: (exampleWidth/n),
        x: i * (exampleWidth/n),
        y: i,
        h: 0,
    };
    ann.push(new soda.Annotation(annConf));
}

let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let renderParams: soda.TrackChartRenderParams = {
    queryStart: 0,
    queryEnd: exampleWidth,
    maxY: n
};

axis.render(renderParams);
chart.render(renderParams);

let rectConf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'ann',
    fillColor: (d: soda.Annotation) => colorScale(d.id)
};

soda.rectangleGlyph(chart, ann, rectConf);
