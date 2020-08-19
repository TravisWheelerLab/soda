import { ChartBase } from "../../charts/chart-base";

export interface RuleConfig {
    addTooltip: boolean;
    tooltipText?: (chart: ChartBase<any>) => string;
    tooltipPosition?: (chart: ChartBase<any>) => number;
}