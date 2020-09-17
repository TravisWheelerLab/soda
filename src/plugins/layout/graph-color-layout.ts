import { cloneDeep } from "lodash";
import { Annotation } from "../../annotations/annotation";

const nIters = 100;
export function graphColorLayout(ann: Annotation[], tolerance: number = 0): number {
    const idMap: Map<string, Annotation> = new Map();
    let edges: Map<string, string[]> = new Map();
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

    const edgeBackup = cloneDeep(edges);
    const degreeBackup = cloneDeep(degrees);

    let bestColorCnt = Infinity;
    let bestColors: Map<string, number> = new Map();
    let nextColor = -1;
    for (let i = 0; i < nIters; i++) {
        const colors: Map<string, number> = new Map();
        nextColor = 1;
        while (degrees.size > 0) {
            let nodes: Map<string, boolean> = new Map();
            let nodeNames = shuffle(Array.from(degrees.keys()));

            for (const key of nodeNames) {
                nodes.set(key, true);
            }
            for (const n of nodeNames) {
                if (nodes.get(n)) {
                    colors.set(n, nextColor);

                    for (const n2 of edges.get(n)!) {
                        nodes.delete(n2);
                    }
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
