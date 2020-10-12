import { Annotation } from "../../annotations/annotation";

function overlap(a: Annotation, b: Annotation, tolerance: number = 0) {
    return (a.x + tolerance <= b.x + b.w + tolerance && a.x + a.w + tolerance >= b.x + tolerance);
}

export class AnnotationGraph {
    idMap: Map<string, Annotation>;
    edges: Map<string, string[]>;
    degrees: Map<string, number>;

    constructor(ann: Annotation[], tolerance: number = 0) {
        this.idMap = new Map();
        // this maps Annotation nodes to a list of the nodes they send edges to
        this.edges = new Map();
        // this maps Annotation nodes to their degree (total number of edges)
        this.degrees = new Map();

        for (const a of ann) {
            this.idMap.set(a.id, a);
            this.edges.set(a.id, []);
            this.degrees.set(a.id, 0);
            for (const b of ann) {
                if (a == b) {
                    continue;
                }
                if (overlap(a, b, tolerance)) {
                    this.edges.set(a.id, this.edges.get(a.id)!.concat(b.id));
                    this.degrees.set(a.id, this.degrees.get(a.id + 1)!);
                }
            }
        }
    }

    public getVertices(): string[] {
        return Array.from(this.idMap.keys());
    }

    public getEdges(n: string): string[] {
        let edges: string[] | undefined = this.edges.get(n);
        if (edges == undefined) {
            edges = [];
        }
        return edges;
    }

    public getVerticesSortedByWidth(): string[] {
        let verts = Array.from(this.degrees.keys()).sort((v1, v2) => {
            if (this.getAnnotationFromId(v1).getW() > this.getAnnotationFromId(v2).getW()) {
                return -1;
            } else {
                return 1;
            }
        });
        return verts;
    }

    public getAnnotationFromId(id: string): Annotation {
        let ann = this.idMap.get(id);
        if ( ann == undefined) {
            throw(`No annotation with id: ${id} in annotation graph`);
        }
        return ann;
    }
}


