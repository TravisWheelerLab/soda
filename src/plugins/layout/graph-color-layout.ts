import { cloneDeep } from "lodash";
import { Annotation } from "../../annotations/annotation";

export function graphColorLayout(ann: Annotation[], nIters: number = 100, tolerance: number = 0): number {
    // This function takes an array of Annotations, turns them into a graph in which
    // there is an edge between any Annotations that would overlap in the x-dimension.
    // It then uses a graph coloring heuristic to find a "good enough" coloring for
    // the graph, which can be translated into a layout by assigning every Annotation
    // node of the same color to the same y-coordinate.
    // **The return value is the number of colors in the best coloring, which is the
    //   same thing as the number of "layers" in the layout
    const idMap:  Map<string, Annotation> = new Map();
    // this maps Annotation nodes to a list of the nodes they send edges to
    let edges: Map<string, string[]> = new Map();
    // this maps Annotation nodes to their degree (total number of edges)
    let degrees: Map<string, number> = new Map();

    for (const a of ann) {
        idMap.set(a.id, a);
        edges.set(a.id, []);
        degrees.set(a.id, 0);
        for (const b of ann) {
            if (a == b) {
                continue;
            }
            if (overlap(a, b, tolerance)) {
                edges.set(a.id, edges.get(a.id)!.concat(b.id));
                degrees.set(a.id, degrees.get(a.id + 1)!);
            }
        }
    }

    // we will make copies of the maps, since the
    // algorithm clobbers them in each iteration
    const edgeBackup = cloneDeep(edges);
    const degreeBackup = cloneDeep(degrees);

    // the number of colors in the best coloring so far
    let bestColorCnt = Infinity;
    // this maps node->{color in best coloring}
    let bestColors: Map<string, number> = new Map();
    // we use integers to enumerate the colors
    let nextColor = -1;
    // this algorithm works as follows:
    //   select a random set of nodes that are non-adjacent and assign them a color
    //   remove those nodes from the graph
    //   repeat the process with the remaining subgraph until all nodes are colored
    for (let i = 0; i < nIters; i++) {
        // this maps node->{color in best coloring} at the current iteration
        const colors: Map<string, number> = new Map();
        nextColor = 1;
        while (degrees.size > 0) {
            // we use this map to determine whether or not we
            // have colored any given node during this iteration
            let nodes: Map<string, boolean> = new Map();
            // take a random ordering of the remaining nodes
            let nodeNames = shuffle(Array.from(degrees.keys()));

            for (const n of nodeNames) {
                nodes.set(n, true);
            }
            for (const n of nodeNames) {
                if (nodes.get(n)) {
                    // take the first node and assign it a color
                    colors.set(n, nextColor);

                    for (const n2 of edges.get(n)!) {
                        // remove all of that nodes adjacent nodes from consideration
                        nodes.delete(n2);
                    }
                    // now remove that node entirely
                    nodes.delete(n);
                    degrees.delete(n);
                    edges.delete(n);
                }
            }
            nextColor++;
        }

        nextColor--;
        edges = cloneDeep(edgeBackup);
        degrees = cloneDeep(degreeBackup);

        if (nextColor < bestColorCnt) {
            bestColorCnt = nextColor;
            bestColors = colors;
        }
    }
    for (const node of bestColors.keys()) {
        // here we actually set the y values based off of the coloring
        idMap.get(node)!.y = bestColors.get(node)! - 1;
    }
    return (nextColor);
}

function overlap(a: Annotation, b: Annotation, tolerance: number = 0) {
    return (a.x + tolerance <= b.x + b.w + tolerance && a.x + a.w + tolerance >= b.x + tolerance);
}

function shuffle(a: string[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
