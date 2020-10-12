import { cloneDeep } from "lodash";
import { Annotation } from "../../annotations/annotation";
import { AnnotationGraph } from "./annotation-graph"

export function graphColorLayout(ann: Annotation[], nIters: number = 100, tolerance: number = 0): number {
    // This function takes an array of Annotations, turns them into a graph in which
    // there is an edge between any Annotations that would overlap in the x-dimension.
    // It then uses a graph coloring heuristic to find a "good enough" coloring for
    // the graph, which can be translated into a layout by assigning every Annotation
    // node of the same color to the same y-coordinate.
    // **The return value is the number of colors in the best coloring, which is the
    //   same thing as the number of "layers" in the layout

    const graph = new AnnotationGraph(ann, tolerance);

    // we will make copies of the maps, since the
    // algorithm clobbers them in each iteration
    let edgesCopy = cloneDeep(graph.edges);
    let degreesCopy = cloneDeep(graph.degrees);

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
        while (degreesCopy.size > 0) {
            // we use this map to determine whether or not we
            // still want to consider each vert in this iteration
            let vertNotChecked: Map<string, boolean> = new Map();
            // take a random ordering of the remaining nodes
            let verts = shuffle(Array.from(degreesCopy.keys()));

            for (const n of verts) {
                vertNotChecked.set(n, true);
            }
            for (const n of verts) {
                if (vertNotChecked.get(n)) {
                    // take the next vertex and assign it a color
                    colors.set(n, nextColor);

                    for (const n2 of edgesCopy.get(n)!) {
                        // remove all of that vertices adjacent vertices from consideration
                        vertNotChecked.delete(n2);
                    }
                    // now remove that vertex entirely
                    vertNotChecked.delete(n);
                    degreesCopy.delete(n);
                    edgesCopy.delete(n);
                }
            }
            nextColor++;
        }

        nextColor--;
        edgesCopy = cloneDeep(graph.edges);
        degreesCopy = cloneDeep(graph.degrees);

        if (nextColor < bestColorCnt) {
            bestColorCnt = nextColor;
            bestColors = colors;
        }
    }
    for (const vert of bestColors.keys()) {
        // here we actually set the y values based off of the coloring
        graph.getAnnotationFromId(vert).y = bestColors.get(vert)! - 1;
    }
    return (nextColor);
}

function shuffle(a: string[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
