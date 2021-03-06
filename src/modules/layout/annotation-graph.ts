import {Annotation} from "../../annotations/annotation";

/**
 * @hidden
 */
function annotationsOverlap(a: Annotation, b: Annotation, tolerance: number = 0) {
    return (a.x + tolerance <= b.x + b.w + tolerance && a.x + a.w + tolerance >= b.x + tolerance);
}

/**
 * This class represents Annotations as a graph, in which there is an edge between two Annotations if they
 * horizontally overlap in semantic coordinate space.
 */
export class AnnotationGraph<A extends Annotation> {
    /**
     * This maps from Annotation id's to Annotation objects
     */
    idMap: Map<string, A>;
    /**
     * This maps from Annotation id A to a list of Annotation id's that annotation id A shares an edge with.
     */
    edges: Map<string, string[]>;
    /**
     * This maps from Annotation id A to the number of edges it shares with other Annotations.
     */
    degrees: Map<string, number>;

    constructor(ann: A[],
                tolerance: number = 0,
                edgeFunction: (a: A, b: A, tolerance: number) => boolean = annotationsOverlap) {
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
                if (edgeFunction(a, b, tolerance)) {
                    this.edges.set(a.id, this.edges.get(a.id)!.concat(b.id));
                    this.degrees.set(a.id, this.degrees.get(a.id)! + 1);
                }
            }
        }
    }

    /**
     * Get a list of the IDs for each vertex in the graph.
     */
    public getVertices(): string[] {
        return Array.from(this.degrees.keys());
    }

    /**
     * Get a list of the vertices with which the supplied vertex shares an edge with.
     * @param vertex The ID of the vertex to check.
     */
    public getEdges(vertex: string): string[] {
        let edges: string[] | undefined = this.edges.get(vertex);
        if (edges == undefined) {
            edges = [];
        }
        return edges;
    }

    /**
     * Get the actual Annotation object from a vertex ID.
     * @param id The vertex ID.
     */
    public getAnnotationFromId(id: string): A {
        let ann = this.idMap.get(id);
        if ( ann == undefined) {
            throw(`No annotation with id: ${id} in annotation graph`);
        }
        return ann;
    }
}


