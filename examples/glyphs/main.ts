import * as soda from "@traviswheelerlab/soda"

let axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.TrackChart({selector: '#track-chart', binHeight:24});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

let rectAnnConf: soda.AnnotationConfig[]  = [
    {"id": "0",  "x": 0, "w": 95, "y": 0},
    {"id": "1",  "x": 0, "w": 95, "y": 1},
    {"id": "2",  "x": 0, "w": 95, "y": 2}
];

let rectAnn: soda.Annotation[] = rectAnnConf.map((conf) => {
    return new soda.Annotation(conf);
});

let lineAnnConf: soda.AnnotationConfig[]  = [
    {"id": "3",  "x": 100, "w": 95, "y": 0},
    {"id": "4",  "x": 100, "w": 95, "y": 1},
    {"id": "5",  "x": 100, "w": 95, "y": 2}
];

let lineAnn = lineAnnConf.map((a) => {
    return new soda.Annotation(a);
});

let chevronLineAnnConf: soda.AnnotationConfig[]  = [
    {"id": "6",  "x": 200, "w": 95, "y": 0},
    {"id": "7",  "x": 200, "w": 95, "y": 1},
    {"id": "8",  "x": 200, "w": 95, "y": 2}
];

// @ts-ignore
let chevronLineAnn: soda.OrientedAnnotation[] = chevronLineAnnConf.map((a) => {
    return {
        id: a.id,
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

let chevronRectAnnConf: soda.AnnotationConfig[]  = [
    {"id": "9",  "x": 300, "w": 95, "y": 0},
    {"id": "10", "x": 300, "w": 95, "y": 1},
    {"id": "11", "x": 300, "w": 95, "y": 2}
];

// @ts-ignore
let chevronRectAnn: soda.OrientedAnnotation[] = chevronRectAnnConf.map((a) => {
    return {
        id: a.id,
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

let sandwichConf: soda.AnnotationConfig[] = [
    {"id": "15", "x": 505, "w": 95, "y": 0},
    {"id": "16", "x": 505, "w": 95, "y": 1},
    {"id": "17", "x": 505, "w": 95, "y": 2},
    {"id": "18", "x": 400, "w": 25, "y": 1},
    {"id": "19", "x": 400, "w": 45, "y": 2}
]

let sandwichAnn: soda.Annotation[] = sandwichConf.map((conf) => {
    return new soda.Annotation(conf);
});

let textAnnConf: soda.AnnotationConfig[]  = [
    {"id": "12", "x": 500, "w": 95, "y": 0},
    {"id": "13", "x": 500, "w": 75, "y": 1},
    {"id": "14", "x": 500, "w": 55, "y": 2}
]

// @ts-ignore
let textAnn: soda.TextAnnotation[] = textAnnConf.map((a) => {
    return {
        id: a.id,
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

let renderParams: soda.TrackChartRenderParams = {
    queryStart: 0,
    queryEnd: 1000,
    maxY: 4
};

axis.initialRender(renderParams);
chart.initialRender(renderParams);

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
soda.horizontalLineGlyph(chart, lineAnn.slice(0,1), lineConf);
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
soda.horizontalLineGlyph(chart, lineAnn.slice(1,2), lineConf);
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
soda.horizontalLineGlyph(chart, lineAnn.slice(2,3), lineConf);
soda.chevronRectangleGlyph(chart, chevronRectAnn.slice(2,3), chevronRectConf);
soda.chevronLineGlyph(chart, chevronLineAnn.slice(2,3), chevronLineConf);
soda.textGlyph(chart, textAnn.slice(2,3), textConf);

let rConf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'rsan',
    strokeColor: () => '#984ea3',
    fillColor: () => '#984ea3'
}

soda.rectangleGlyph(chart, sandwichAnn, rConf);
