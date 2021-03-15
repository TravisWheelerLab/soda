import * as soda from "@traviswheelerlab/soda"

const CONF: soda.AnnotationConfig[]  = [
    {"id": "0",  "x": 0,   "w": 95, "y": 0},
    {"id": "1",  "x": 100, "w": 95, "y": 0},
    {"id": "2",  "x": 200, "w": 95, "y": 0},
    {"id": "3",  "x": 300, "w": 95, "y": 0},
    {"id": "4",  "x": 400, "w": 95, "y": 0},
    {"id": "5",  "x": 500, "w": 95, "y": 0},
    {"id": "6",  "x": 600, "w": 95, "y": 0},
    {"id": "7",  "x": 700, "w": 95, "y": 0},
    {"id": "8",  "x": 800, "w": 95, "y": 0},
    {"id": "9",  "x": 900, "w": 95, "y": 0},
    {"id": "10", "x": 0,   "w": 95, "y": 1},
    {"id": "11", "x": 100, "w": 95, "y": 1},
    {"id": "12", "x": 200, "w": 95, "y": 1},
    {"id": "13", "x": 300, "w": 95, "y": 1},
    {"id": "14", "x": 400, "w": 95, "y": 1},
    {"id": "15", "x": 500, "w": 95, "y": 1},
    {"id": "16", "x": 600, "w": 95, "y": 1},
    {"id": "17", "x": 700, "w": 95, "y": 1},
    {"id": "18", "x": 800, "w": 95, "y": 1},
    {"id": "19", "x": 900, "w": 95, "y": 1},
    {"id": "20", "x": 0,   "w": 95, "y": 2},
    {"id": "21", "x": 100, "w": 95, "y": 2},
    {"id": "22", "x": 200, "w": 95, "y": 2},
    {"id": "23", "x": 300, "w": 95, "y": 2},
    {"id": "24", "x": 400, "w": 95, "y": 2},
    {"id": "25", "x": 500, "w": 95, "y": 2},
    {"id": "26", "x": 600, "w": 95, "y": 2},
    {"id": "27", "x": 700, "w": 95, "y": 2},
    {"id": "28", "x": 800, "w": 95, "y": 2},
    {"id": "29", "x": 900, "w": 95, "y": 2}
];

export const ANN: soda.Annotation[] = CONF.map( (conf) => new soda.Annotation(conf) );

export const ORIENTED_ANN: soda.OrientedAnnotation[] = ANN.map( (a) => {
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
        },
        setY(y: number): void {
            this.y = y;
        },
        getX2(): number {
            return this.x + this.w
        }
    }
});
