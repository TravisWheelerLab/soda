import * as d3 from 'd3'
import * as soda from "@traviswheelerlab/soda"
import {ORIENTED_ANN as ann} from './ann'

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
    let rectConf: soda.ChevronLineConfig<soda.OrientedAnnotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
        selector: 'ann' + i.toString(),
        y: (a, c) => a.y * c.binHeight + i,
        // chevronH: (a, c) => c.binHeight - i,
        strokeColor: (a) => colorScale(a.id),
        // strokeWidth: () => i,
        chevronStrokeColor: (a) => colorScale(a.id),
        // strokeOpacity: () => (i/10),
    };

    soda.chevronLineGlyph(chart, ann.slice(i, i+1), rectConf);
}
