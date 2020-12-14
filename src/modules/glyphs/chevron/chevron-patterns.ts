import * as defaults from "./chevron-defaults";
import {OrientedAnnotation} from "../../../annotations/oriented-annotation";
import {Chart} from "../../../charts/chart";
import {ChevronPrimitiveConfig} from "./chevron-config";
import * as d3 from "d3";

export enum ChevronPatternType {
    Rectangle = "rectangle",
    Line = "line",
}

export function chevronPatternId (t: ChevronPatternType): string {
    return `chevron-${t}-bg`;
}

function initSvgDefs(selection: d3.Selection<SVGElement, any, HTMLElement, any>): void {
    let defSelection = selection.select('defs');
    if (defSelection.node() == null) {
        selection.append('defs');
    }
}

export function createChevronPatterns<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[],
                                                                                          conf: ChevronPrimitiveConfig<A, C>,
                                                                                          patternType: ChevronPatternType): void {
    initSvgDefs(chart.svgSelection);

    let patternSelection = chart.svgSelection.select('defs')
        .selectAll<SVGPatternElement, A>(`${conf.selector}.pattern`)
        .data(ann, (a) => a.id);

    const patternEnter = patternSelection
        .enter()
        .append('pattern');

    const patternMerge = patternEnter.merge(patternSelection);

    const backgroundFillColor = conf.backgroundFillColor || (() => 'black');
    const backgroundFillOpacity = conf.backgroundFillOpacity || (() => 1);

    // TODO: this is convoluted and I should find a way to simplify this
    let chevronY: (a: A, c: C) => number;
    if (patternType == ChevronPatternType.Rectangle) {
        chevronY = conf.chevronY || defaults.chevronRectYFn;
    }
    else if (patternType == ChevronPatternType.Line) {
        chevronY = conf.chevronY || defaults.chevronLineYFn;
    }
    const chevronH = conf.chevronH || defaults.chevronHFn;
    const chevronSpacing = conf.chevronSpacing || (() => 0);
    const chevronStrokeColor = conf.chevronStrokeColor || (() => 'ghostwhite');
    const chevronStrokeWidth = conf.chevronStrokeWidth || (() => 1);
    const chevronStrokeOpacity = conf.chevronStrokeOpacity || (() => 1);
    const chevronFillOpacity = conf.chevronFillOpacity || (() => 1);

    // for every oriented annotation, we create a pattern
    patternEnter
        .attr('class', conf.selector)
        .attr('id', (a) => `${chevronPatternId(patternType)}-${a.id}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('viewBox', (a) => defaults.chevronPatternViewBoxFn(a, chevronH(a, chart), chevronSpacing(a, chart)))
        .attr('width', (a) => (chevronH(a, chart) / 2) + chevronSpacing(a, chart))
        .attr('height', (a) => chevronH(a, chart))
        .attr('preserveAspectRatio', 'xMinYMid meet');

    // in every pattern, we place a rectangle to get our background color
    const patternRectangles = patternEnter.append('rect');

    patternRectangles
        .attr('class', 'pattern')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', (a) => chevronH(a, chart) / 2 + chevronSpacing(a, chart))
        .attr('height', (a) => chevronH(a, chart));

    if (patternType == ChevronPatternType.Rectangle) {
        // if we are making a chevron rectangle, we want to actually have a fill color
        patternRectangles
            .attr('fill', (a) => backgroundFillColor(a, chart))
            .attr('fill-opacity', (a) => backgroundFillOpacity(a, chart));
    }

    else if (patternType == ChevronPatternType.Line) {
        // if we are making a chevron lien, we want the rectangle to be totally transparent
        patternRectangles
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0);
    }

    // in every pattern, draw the chevrons
    const patternPaths = patternEnter.append('path');

    patternPaths
        .style('stroke-linejoin', 'miter')
        .attr('d', (a) => defaults.chevronPathDFn(a, chevronH(a, chart)))
        .style('stroke', (a) => chevronStrokeColor(a, chart))
        .style('stroke-width', (a) => chevronStrokeWidth(a, chart))
        .style('stroke-opacity', (a) => chevronStrokeOpacity(a, chart))
        .style('fill-opacity', 0);

    if (conf.chevronFillColor !== undefined) {
        patternPaths
            .style('fill', (a) => conf.chevronFillColor!(a, chart))
            .style('fill-opacity', (a) => chevronFillOpacity(a, chart))
    }

    // position all of the patterns so that they align with the correct
    // side of the rectangle depending on the alignment orientation
    patternMerge
        .attr('x', (a) => defaults.chevronXFn(a));

    if (patternType == ChevronPatternType.Rectangle) {
        patternMerge
            .attr('y', (a) => chevronY(a, chart));
    }
    else if (patternType == ChevronPatternType.Line) {
        patternMerge
            .attr('y', (a) => chevronY(a, chart) - chevronH(a, chart)/2);
    }

    patternSelection.exit()
        .remove();
}
