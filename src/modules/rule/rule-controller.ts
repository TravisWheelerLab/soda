import * as d3 from 'd3';
import {ChartBase} from '../../charts';
import {Plugin} from '../plugin';

/**
 * This plugin object allows a dynamic vertical rule to be added to any Chart.
 */
export class RuleController implements Plugin {
    /**
     * A list of the rule divs controlled by the controller.
     */
    ruleDivs: d3.Selection<any, any, any, any>[] = [];
    /**
     * A list of the rule tooltips controlled by the controller.
     */
    tooltipDivs: d3.Selection<any, any, any, any>[] = [];
    /**
     * A list of Charts that the RuleController will place rules in.
     */
    components: ChartBase<any>[];
    /**
     * The component that the RuleController has identified as the one that the user is currently hovering with the
     * mouse.
     */
    activeComponent?: ChartBase<any>;
    /**
     * A boolean flag that describes whether or not the rules are being displayed.
     */
    enabled = false;

    constructor() {
        this.components = [];
        this.activeComponent = undefined;
    }

    /**
     * This should be called by registered components whenever the height of a component changes.
     */
    public alert(): void {
        this.updateRuleSize();
    }

    public toggle(self: RuleController = this): void {
        if (self.enabled) {
            self.disable();
        } else {
            self.enable();
        }
    }

    public enable(): void {
        this.enabled = true;
        for (const sel of this.ruleDivs) {
            sel.style('border-left', '2px dotted');
        }
        for (const sel of this.tooltipDivs) {
            sel.style('opacity', 1);
        }
    }

    public disable(): void {
        this.enabled = false;
        for (const sel of this.ruleDivs) {
            sel.style('border-left', 'none');
        }
        for (const sel of this.tooltipDivs) {
            sel.style('opacity', 0);
        }
    }

    /**
     * Add a component to the RuleController and add a rule to that component.
     * @param component
     */
    public addComponent(component: ChartBase<any>) {
        this.components.push(component);
        component.plugins.push(this);
        // actually create the rule
        this.createVerticalRule(component);
        // create the tooltip that will display the chromosome position currently hovered
        this.createRuleTooltip(component);
        component.svgSelection
            .on('mousemove', () => this.chartMouseMove(component))
    }

    /**
     * This method registers a list of components with the RuleController.
     * @param components
     */
    public addComponents(components: ChartBase<any>[]): void {
        for (const comp of components) {
            this.addComponent(comp);
        }
    }

    /**
     * A utility function that creates the actual rule.
     * @param chart
     */
    protected createVerticalRule(chart: ChartBase<any>) {
        let containerDims = chart.getContainerDimensions();
        let top = containerDims.y;
        let ruleSelection = d3.select(chart.getSelector())
            .append('div')
            .attr('class', 'vertical-rule')
            .style('height', chart.height + 'px')
            .style('top', top + 'px')
            .style('position', 'absolute')
            .style('border-left', 'none')
            .style('text-align', 'left')

        this.ruleDivs.push(ruleSelection);
    }

    /**
     * A utility function that creates the tooltip that floats next to the rule.
     * @param chart
     */
    protected createRuleTooltip(chart: ChartBase<any>) {
        let tooltipSelection = d3.select(chart.getSelector())
            .append('div')
            .attr('class', 'rule-tooltip')
            .style('position', 'absolute')
            .style('border-radius', '8px')
            .style('background', 'lightsteelblue')
            .style('opacity', 0);

        this.tooltipDivs.push(tooltipSelection);
    }

    /**
     * This method is routed to the mousemove event on each components' SVG viewport. It updates the activeComponent
     * property, and then moves the rule to follow the mouse position.
     * @param chart
     */
    public chartMouseMove(chart: ChartBase<any>) {
        if (this.enabled) {
            // this is called any time the mouse moves on a chart
            // set the active component
            this.activeComponent = chart;
            // then defer to the function that will actually move the rules
            this.moveRule();
        }
    }

    /**
     * This method is responsible for moving the rule on each of the RuleController's components.
     */
    public moveRule(): void {
        let mouseX = d3.event.pageX;
        let mouseY = d3.event.pageY;

        for (const comp of this.components) {
            // move the rules
            d3.select(comp.getSelector())
                .selectAll('div.vertical-rule')
                .style('left', (mouseX + 5) + 'px');

            // we need to figure out where the svg is actually sitting in the absolute
            // coordinate system so that we can figure out the position of the rule
            // relative to the chromosome coordinate system
            const compSvgDims = comp.getSvgDimensions();
            let tooltipText = Math.round(comp.getXScale().invert(mouseX - compSvgDims.x + 5));
            d3.select(comp.getSelector())
                .selectAll('div.rule-tooltip')
                .style('opacity', () => {
                    // we'll hide the tooltip for every component except the active one
                    if (this.activeComponent == comp) {
                        return (1);
                    }
                    else {
                        return (0);
                    }
                })
                .style('top', (mouseY - 20) + 'px')
                .style('left', (mouseX + 10) + 'px')
                .html(tooltipText.toString());
        }
    }

    /**
     * This method checks each component's height, and adjusts that height of each embedded rule to match it.
     */
    public updateRuleSize(): void {
        // whenever the charts resize themselves, we need to
        // resize the rules too
        for (const comp of this.components) {
            let svgDims = comp.getSvgDimensions();
            let top = svgDims.y;
            d3.select(comp.getSelector())
                .selectAll('div.vertical-rule')
                .style('height', comp.height + 'px')
                .style('top', top + 'px')
        }
    }
}
