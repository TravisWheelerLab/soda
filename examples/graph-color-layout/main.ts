import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

const axis = new soda.AxisChart({selector: '#axis-chart'});
const chart = new soda.TrackChart({selector: '#track-chart'});
const chart2 = new soda.TrackChart({selector: '#track-chart2'});
const chart3 = new soda.TrackChart({selector: '#track-chart3'});

const charts = [axis, chart, chart2, chart3];

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

// ann.push(new soda.Annotation({h: 0, id: '0', w: 1000, x: 0, y: 0}));
// ann.push(new soda.Annotation({h: 0, id: '1', w: 1000, x: 1, y: 0}));
// ann.push(new soda.Annotation({h: 0, id: '2', w: 1000, x: 2, y: 0}));

let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let axisParams: soda.AxisRenderParams = {
    queryEnd: w,
    queryStart: 0
};

axis.render(axisParams);

for (let i = 1; i < charts.length; i++) {
    let layerCount = 0;
    if (i == 1) {
        layerCount = soda.intervalGraphLayout(ann);
    }
    else if (i == 2) {
        layerCount = soda.heuristicGraphLayout(ann);
    }
    else if (i == 3) {
        layerCount = soda.greedyGraphLayout(ann);
    }

    let trackParams: soda.TrackChartRenderParams = {
        maxY: layerCount,
        queryEnd: w,
        queryStart: 0
    };

    charts[i].render(trackParams);

    let rectConf = {
        selector: 'ann', fillColor: (d: soda.Annotation) => colorScale(d.id)
    };

    soda.rectangleGlyph(charts[i], ann, rectConf);
}

function randInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
