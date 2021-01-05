import * as soda from "@traviswheelerlab/soda"
import { BenchAnnotation } from "./benchmark/BenchmarkChart";

export const ANN = uniformAnn(10, 95, 5, 1);
export const ORIENTED_ANN = uniformOrientedAnn(10, 95, 5, 1);

export function uniformAnn(n: number, width: number, spacing: number, layers: number): soda.Annotation[] {
    const conf: soda.AnnotationConfig[] = [];
    let id = 0;
    for (let j = 0; j < layers; j++) {
        for (let i = 0; i < n; i++) {
            let annConf: soda.AnnotationConfig = {
                id: (id++).toString(),
                w: width,
                x: i * (width + spacing),
                y: j,
                h: 0,
            };
            conf.push(annConf);
        }
    }
    return conf.map( (conf) => new soda.Annotation(conf) )
}

export function uniformOrientedAnn(n: number, width: number, spacing: number, layers: number): soda.OrientedAnnotation[] {
    let ann = uniformAnn(n, width, spacing, layers);
    let fwd = true;
    return ann.map((a) => {
        fwd = !fwd;
        return {
            id: a.id,
            h: a.h,
            w: a.w,
            x: a.x,
            y: a.y,
            orientation: (() => {
                if (fwd) {
                    return soda.Orientation.Forward;
                }
                else {
                    return soda.Orientation.Reverse;
                }
            })(),
            getW(): number {
                return this.w;
            },
            getX(): number {
                return this.x;
            }
        }
    });
}

export function uniformBenchAnn(n: number, width: number, spacing: number, layers: number): BenchAnnotation[] {
    let ann = uniformAnn(n, width, spacing, layers);
    let fwd = true;
    return ann.map((a) => {
        fwd = !fwd;
        return {
            id: a.id,
            h: a.h,
            w: a.w,
            x: a.x,
            y: a.y,
            text: [],
            drawThresholds: [],
            orientation: (() => {
                if (fwd) {
                    return soda.Orientation.Forward;
                }
                else {
                    return soda.Orientation.Reverse;
                }
            })(),
            getW(): number {
                return this.w;
            },
            getX(): number {
                return this.x;
            }
        }
    });
}
