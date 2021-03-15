import * as d3 from 'd3'
import * as soda from "@traviswheelerlab/soda"
import {ANN as ann} from './ann'

const axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.TrackChart({selector: '#track-chart', binHeight: 14});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

let colorScale = d3.scaleOrdinal(d3.schemeDark2);

let renderParams: soda.TrackChartRenderParams = {
    queryStart: 0,
    queryEnd: 1000,
    maxY: 4
};

axis.initialRender(renderParams);
chart.initialRender(renderParams);

for (let i = 0; i < 10; i++) {
    let rectConf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
        selector: 'ann' + i.toString(),
        y: (a, c) => a.y * c.binHeight + i,
        h: (a, c) => c.binHeight - i,
        x: (a) => a.x + (5 * i),
        w: (a) => a.w - (10 * i),
        fillColor: (d) => colorScale(d.id),
        strokeColor: (d) => colorScale(d.id),
        strokeWidth: () => i,
        strokeOpacity: () => (i/10),
    };
    if (i == 0) {
        rectConf.x = undefined;
        rectConf.w = undefined;
    }
    soda.rectangleGlyph(chart, ann.slice(i, i+1), rectConf);
}
