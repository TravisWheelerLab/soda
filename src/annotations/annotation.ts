import { AnnotationConfig } from './annotation-config'

// this is the base class for an annotations in SODA
// it is essentially the data that supplies the information
// to draw a single visual component within a chart
export class Annotation {
    readonly id: string;
    readonly x: number;
    y: number;
    readonly w: number;
    readonly h: number;

    constructor(config: AnnotationConfig) {
        this.id = config.id;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w;
        this.h = config.h;
    }

    public getX(): number {
        return (this.x);
    }
        
    public getW(): number {
        return (this.w);
    }
}

