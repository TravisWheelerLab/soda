import { ChartConfig } from '../chart-config';
import { TrackChart } from "./track-chart";

export interface TrackChartConfig extends ChartConfig {
    scaleExtent?: [number, number];
    translateExtent?: (chart: TrackChart<any>) => [[number, number], [number, number]];
}
