import * as d3 from 'd3'
import * as soda from "@traviswheelerlab/soda"
import {ANN as ann} from '../ann'

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

axis.render(renderParams);
chart.render(renderParams);

for (let i = 0; i < 3; i++) {
    let lineConf: soda.HorizontalLineConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
        selector: 'ann' + i.toString(),
        x1: (a) => a.x + 5 * i,
        x2: (a) => a.x + a.w - 5 * i,
        strokeColor: (d: soda.Annotation) => colorScale(d.id),
        strokeWidth: () => 1,
    };
    if (i == 0) {
        lineConf.x1 = undefined;
        lineConf.x2 = undefined;
    }
    if (i == 1) {
       lineConf.y = (a, c) => a.y * c.binHeight + c.binHeight/4
    }
    else if (i == 2) {
        lineConf.strokeDashArray = () => '3 3';
    }
    soda.horizontalLine(chart, ann.slice(i, i+1), lineConf);
}

for (let i = 3; i < 6; i++) {
    let lineConf: soda.VerticalLineConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
        selector: 'ann' + i.toString(),
        x: (a) => a.x + 5 * i,
        strokeColor: (d: soda.Annotation) => colorScale(d.id),
        strokeWidth: () => 2,
    };
    if (i == 3) {
        lineConf.x = undefined;
    }
    else if (i == 4) {
        lineConf.y1 = (a, c) => a.y * c.binHeight + c.binHeight/4;
        lineConf.y2 = (a, c) => a.y * c.binHeight + c.binHeight/2;
    }
    else if (i == 5) {
        lineConf.strokeDashArray = () => '3 3';
    }
    soda.verticalLine(chart, ann.slice(i, i+1), lineConf);
}

for (let i = 6; i < 10; i++) {
    let lineConf: soda.LineConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
        selector: 'ann' + i.toString(),
        x1: (a) => a.x,
        x2: (a) => a.x + a.w,
        y1: () => 0,
        y2: () => 0,
        strokeColor: (d: soda.Annotation) => colorScale(d.id),
        strokeWidth: () => 3,
    };
    if (i == 6) {
        lineConf.y1 = (a, c) => a.y * c.binHeight;
        lineConf.y2 = (a, c) => (a.y + 1) * c.binHeight;
    }
    else if (i == 7) {
        lineConf.y1 = (a, c) => a.y * c.binHeight;
        lineConf.y2 = (a, c) => (a.y + 1) * c.binHeight;
        lineConf.strokeDashArray = () => '6 3';
    }
    else if (i == 8) {
        lineConf.y1 = (a, c) => (a.y + 1) * c.binHeight;
        lineConf.y2 = (a, c) => a.y * c.binHeight;
        lineConf.strokeOpacity = () => 0.5;
    }
    else if (i == 9) {
        lineConf.y1 = (a, c) => (a.y + 1) * c.binHeight;
        lineConf.y2 = (a, c) => a.y * c.binHeight;
        lineConf.strokeDashArray = () => '3 6';
        lineConf.strokeOpacity = () => 0.1;
    }
    soda.lineGlyph(chart, ann.slice(i, i+1), lineConf);
}
