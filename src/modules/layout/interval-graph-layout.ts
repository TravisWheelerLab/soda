import {Annotation} from "../../annotations/annotation";
import {AnnotationGraph} from "./annotation-graph";

/**
 * @hidden
 */
function sortByX(verts: string[], graph: AnnotationGraph<Annotation>): void {
    // sorts the vertices by Annotation X coordinates (the start of the annotation)
    verts.sort((v1: string, v2: string) => {
        if (graph.getAnnotationFromId(v1).getX() > graph.getAnnotationFromId(v2).getX()) {
            return 1;
        } else {
            return -1;
        }
    });
}

/**
 * This function takes a list of Annotation objects and uses a greedy interval scheduling algorithm to assign each
 * of them a y coordinate in terms of horizontal bins that will prevent any horizontal overlap when they are
 * rendered in a Chart.
 * @param ann
 * @param tolerance
 */
export function intervalGraphLayout(ann: Annotation[], tolerance: number = 0){
    if (ann.length == 0) {
        return 0;
    }

    let graph: AnnotationGraph<Annotation> = new AnnotationGraph(ann, tolerance);
    let colorCount = 0;
    let verts = graph.getVertices();
    sortByX(verts, graph);
    let colors: Map<number, string[]> = new Map();
    colors.set(0, [verts[0]]);
    graph.getAnnotationFromId(verts[0]).y = 0;
    for (const v of verts.slice(1)) {
        let vEdges = graph.getEdges(v)!;
        let vColor = 0;
        for (let i = 0; i <= colorCount; i++) {
            let vertsInColor = colors.get(i)!;
            let u = vertsInColor[vertsInColor.length - 1];
            if (vEdges.indexOf(u) > -1) {
                vColor++;
            }
            else {
                break;
            }
        }

        let vColors = colors.get(vColor);
        if (vColors == undefined) {
            colors.set(vColor, [v]);
            colorCount++;
        }
        else {
            vColors.push(v);
        }

        graph.getAnnotationFromId(v).setY(vColor)
    }
    return (colorCount++);
}
