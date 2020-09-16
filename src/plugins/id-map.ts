import * as d3 from 'd3';
import { Annotation } from '../annotations';

export const idAnnotationMap: Map<string, Annotation> = new Map();
export const idSelectionMap: Map<string, d3.Selection<any, any, any, any>> = new Map();

export function mapIdToAnnotation(id: string, ann: Annotation): void {
    idAnnotationMap.set(id, ann);
}

export function getAnnotationById(id: string): Annotation {
    let annotation = idAnnotationMap.get(id);
    if (annotation == undefined) {
        throw(`The Annotation id ${id} is not mapped to any Annotation`);
    }
    return (annotation);
}

export function mapIdToSelection(id: string, selection: d3.Selection<any, any, any, any>): void {
    idSelectionMap.set(id, selection);
}

export function getSelectionById(id: string): d3.Selection<any, any, any, any> {
    let selection = idSelectionMap.get(id);
    if (selection == undefined) {
        throw(`The Annotation id ${id} is not mapped to any D3 selection`);
    }
    return (selection);
}
