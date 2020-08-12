import * as d3 from 'd3';

export abstract class ClickPlugin<T> {
    listenerSelector?: string;
    registerListeners(): void {
        d3.selectAll<d3.BaseType, T>(this.listenerSelector!)
            .on('click', (d: T) => this.applyToClicked(<T> d) );
    }
    abstract applyToClicked(clicked: T): void;
}
