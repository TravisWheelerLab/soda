import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

const axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.TrackChart({selector: '#track-chart', binHeight:24});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

const rectAnnConf: soda.AnnotationConfig[]  = [
    {"id": "0",  "x": 0,   "w": 95, "y": 0, "h": 0},
    {"id": "1",  "x": 0, "w": 95, "y": 1, "h": 0},
    {"id": "2",  "x": 0, "w": 95, "y": 2, "h": 0}
];

const rectAnn: soda.Annotation[] = rectAnnConf.map((conf) => {
    return new soda.Annotation(conf);
});

const lineAnnConf: soda.AnnotationConfig[]  = [
    {"id": "3",  "x": 100, "w": 95, "y": 0, "h": 0},
    {"id": "4",  "x": 100, "w": 95, "y": 1, "h": 0},
    {"id": "5",  "x": 100, "w": 95, "y": 2, "h": 0}
];

const lineAnn = lineAnnConf.map((a) => {
    return new soda.Annotation(a);
});

const chevronLineAnnConf: soda.AnnotationConfig[]  = [
    {"id": "6",  "x": 200, "w": 95, "y": 0, "h": 0},
    {"id": "7",  "x": 200, "w": 95, "y": 1, "h": 0},
    {"id": "8",  "x": 200, "w": 95, "y": 2, "h": 0}
];

const chevronLineAnn = chevronLineAnnConf.map((a) => {
    return {
        id: a.id,
        h: a.h,
        w: a.w,
        x: a.x,
        y: a.y,
        orientation: soda.Orientation.Forward,
        getW(): number {
            return this.w;
        },
        getX(): number {
            return this.x;
        }
    }
});

const chevronRectAnnConf: soda.AnnotationConfig[]  = [
    {"id": "9",  "x": 300, "w": 95, "y": 0, "h": 0},
    {"id": "10", "x": 300,   "w": 95, "y": 1, "h": 0},
    {"id": "11", "x": 300, "w": 95, "y": 2, "h": 0}
];

const chevronRectAnn = chevronRectAnnConf.map((a) => {
    return {
        id: a.id,
        h: a.h,
        w: a.w,
        x: a.x,
        y: a.y,
        orientation: soda.Orientation.Reverse,
        getW(): number {
            return this.w;
        },
        getX(): number {
            return this.x;
        }
    }
});

const textAnnConf: soda.AnnotationConfig[]  = [
    {"id": "12", "x": 500, "w": 95, "y": 0, "h": 0},
    {"id": "13", "x": 500, "w": 75, "y": 1, "h": 0},
    {"id": "14", "x": 500, "w": 55, "y": 2, "h": 0}
]

const textAnn = textAnnConf.map((a) => {
    return {
        id: a.id,
        h: a.h,
        w: a.w,
        x: a.x,
        y: a.y,
        text: [],
        drawThresholds: [],
        getW(): number {
            return this.w;
        },
        getX(): number {
            return this.x;
        }
    }
});

let colorScale = d3.scaleOrdinal(d3.schemePaired);

let renderParams: soda.TrackChartRenderParams = {
    queryStart: 0,
    queryEnd: 1000,
    maxY: 4
};

axis.render(renderParams);
chart.render(renderParams);

let rectConf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'r1',
    strokeColor: () => '#984ea3',
    fillColor: () => '#984ea3'
};

let lineConf: soda.HorizontalLineConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'l1',
    strokeWidth: () => 3,
    strokeColor: () => '#984ea3'
};

let chevronRectConf: soda.ChevronRectangleConfig<soda.OrientedAnnotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'cr1',
    strokeColor: () => '#984ea3',
    fillColor: () => '#984ea3'
};

let chevronLineConf: soda.ChevronLineConfig<soda.OrientedAnnotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'cl1',
    strokeColor: () => '#984ea3',
    chevronStrokeColor: () => '#984ea3',
};

let textConf: soda.TextConfig<soda.TextAnnotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 't1',
    y: (a, c) => (a.y + 1) * c.binHeight - (c.binHeight * .1),
    text: () => ['Some long text', 'Some long...', 'Some...', '...'],
};

soda.rectangleGlyph(chart, rectAnn.slice(0,1), rectConf);
soda.horizontalLine(chart, lineAnn.slice(0,1), lineConf);
soda.chevronRectangleGlyph(chart, chevronRectAnn.slice(0,1), chevronRectConf);
soda.chevronLineGlyph(chart, chevronLineAnn.slice(0,1), chevronLineConf);
soda.textGlyph(chart, textAnn.slice(0,1), textConf);

rectConf = {
    selector: 'r2',
    strokeColor: (d) => '#4daf4a',
    fillColor: (d) => '#4daf4a'
};

lineConf = {
    selector: 'l2',
    strokeDashArray: () => '3, 3',
    strokeWidth: () => 3,
    strokeColor: (d) => '#4daf4a'
};

chevronRectConf = {
    selector: 'cr2',
    strokeColor: (d) => '#4daf4a',
    fillColor: (d) => '#4daf4a',
    chevronSpacing: () => 5,
};

chevronLineConf = {
    selector: 'cl2',
    strokeColor: (d) => '#4daf4a',
    chevronStrokeColor: (d) => '#4daf4a',
    chevronSpacing: () => 5,
};

textConf = {
    selector: 't2',
    y: (a, c) => (a.y + 1) * c.binHeight - (c.binHeight * .1),
    text: () => ['Some long text', 'Some long...', 'Some...', '...'],
};

soda.rectangleGlyph(chart, rectAnn.slice(1,2), rectConf);
soda.horizontalLine(chart, lineAnn.slice(1,2), lineConf);
soda.chevronRectangleGlyph(chart, chevronRectAnn.slice(1,2), chevronRectConf);
soda.chevronLineGlyph(chart, chevronLineAnn.slice(1,2), chevronLineConf);
soda.textGlyph(chart, textAnn.slice(1,2), textConf);

rectConf = {
    selector: 'r3',
    fillColor: (d) => '#377eb8'
};

lineConf = {
    selector: 'l3',
    strokeWidth: () => 3,
    strokeDashArray: () => '5, 1',
    strokeColor: (d) => '#377eb8'
};

chevronRectConf = {
    selector: 'cr3',
    strokeColor: (d) => '#377eb8',
    fillColor: (d) => '#377eb8',
    chevronSpacing: () => 10,
};

chevronLineConf = {
    selector: 'cl3',
    strokeColor: (d) => '#377eb8',
    chevronStrokeColor: (d) => '#377eb8',
    chevronSpacing: () => 10,
};

textConf = {
    selector: 't3',
    y: (a, c) => (a.y + 1) * c.binHeight - (c.binHeight * .1),
    text: () => ['Some long text', 'Some long...', 'Some...', '...'],
};

soda.rectangleGlyph(chart, rectAnn.slice(2,3), rectConf);
soda.horizontalLine(chart, lineAnn.slice(2,3), lineConf);
soda.chevronRectangleGlyph(chart, chevronRectAnn.slice(2,3), chevronRectConf);
soda.chevronLineGlyph(chart, chevronLineAnn.slice(2,3), chevronLineConf);
soda.textGlyph(chart, textAnn.slice(2,3), textConf);

