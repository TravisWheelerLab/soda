import { Annotation } from "../../annotations/annotation";

function annotationsOverlap(a: Annotation, b: Annotation, tolerance: number = 0) {
    return (a.x + tolerance <= b.x + b.w + tolerance && a.x + a.w + tolerance >= b.x + tolerance);
}

/**
 * This class represents Annotations as a graph, in which there is an edge between two Annotations if they
 * horizontally overlap in semantic coordinate space.
 */
export class AnnotationGraph {
    /**
     * This maps from Annotation id's to Annotation objects
     */
    idMap: Map<string, Annotation>;
    /**
     * This maps from Annotation id A to a list of Annotation id's that annotation id A shares an edge with.
     */
    edges: Map<string, string[]>;
    /**
     * This maps from Annotation id A to the number of edges it shares with other Annotations.
     */
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
                if (annotationsOverlap(a, b, tolerance)) {
                    this.edges.set(a.id, this.edges.get(a.id)!.concat(b.id));
                    this.degrees.set(a.id, this.degrees.get(a.id + 1)!);
                }
            }
        }
    }

    public getVertices(): string[] {
        return Array.from(this.degrees.keys());
    }

    public getEdges(n: string): string[] {
        let edges: string[] | undefined = this.edges.get(n);
        if (edges == undefined) {
            edges = [];
        }
        return edges;
    }

    public getAnnotationFromId(id: string): Annotation {
        let ann = this.idMap.get(id);
        if ( ann == undefined) {
            throw(`No annotation with id: ${id} in annotation graph`);
        }
        return ann;
    }
}


