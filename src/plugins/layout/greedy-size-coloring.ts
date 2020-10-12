import { Annotation } from "../../annotations/annotation";
import { AnnotationGraph } from "./annotation-graph";

export function greedySizeColoringLayout(ann: Annotation[], tolerance: number = 0) {
   let graph: AnnotationGraph = new AnnotationGraph(ann, tolerance);

   let nextColor = 1;
   while (graph.degrees.size > 0) {
      // we use this map to determine whether or not we
      // have colored any given node during this iteration
      let nodes: Map<string, boolean> = new Map();
      // take a random ordering of the remaining nodes
      let vertNames = graph.getVerticesSortedByWidth();

      for (const v of vertNames) {
         nodes.set(v, true);
      }
      for (const v of vertNames) {
         if (nodes.get(v)) {
            // take the first node and assign it a color
            graph.getAnnotationFromId(v).y = nextColor - 1;

            for (const v2 of graph.getEdges(v)) {
               // remove all of that nodes adjacent nodes from consideration
               nodes.delete(v2);
            }
            // now remove that node entirely
            nodes.delete(v);
            graph.degrees.delete(v);
            graph.edges.delete(v);
         }
      }
      nextColor++;
   }
   nextColor--;
   return (nextColor);
}
