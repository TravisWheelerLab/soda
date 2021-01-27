import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

let bedData =
`chr1	0	1050	(TAACCC)n	4098.473818
chr1	1050	1242	(CCTCAC)n	4098.473818
chr1	1242	2343	(CCTAAC)n	4098.473818
chr1	2343	2438	(CCTGAC)n	4098.473818
chr1	2438	2467	(CCTAAC)n	4098.473818
chr1	2467	2489	(C*GACC)n	4098.473818
chr1	2489	2872	(CTAACC)n	4098.473818
chr1	2876	3388	repetitive(29)	844.782497
chr1	3388	3547	repetitive(48)	60.411064
chr1	3728	4018	repetitive(61)	201.494277`;

let ann: soda.BedAnnotation[] = soda.bed6Parse(bedData);

const axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.TrackChart({selector: '#track-chart'});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let n = soda.intervalGraphLayout(ann);
let first = ann.reduce(function(prev, curr) {
    return prev.x < curr.x ? prev : curr;
});
let last = ann.reduce(function(prev, curr) {
    return (prev.x + prev.w) > (curr.x + curr.w) ? prev : curr;
});

let renderParams: soda.TrackChartRenderParams = {
    queryStart: first.x,
    queryEnd: last.x + last.w,
    maxY: (n+1)
};

axis.render(renderParams);
chart.render(renderParams);

let rectConf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'bedAnn',
    fillColor: () => 'cyan',
    strokeColor: () => 'cyan',
};

soda.rectangleGlyph(chart, ann, rectConf);
