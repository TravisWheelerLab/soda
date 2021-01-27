import {Annotation, AnnotationConfig} from "./annotation";

/**
 * An Annotation class that contains a group of Annotations. Mostly, this is used to maintain the group of
 * Annotations at the same vertical position--all Annotations in the group will be set to the same y coordinate
 * when the setY() method is called on the AnnotationGroup.
 * @typeParam A The type of annotation that will live in this group.
 */
export class AnnotationGroup<A extends Annotation> extends Annotation {
    group: A[] = [];
    x2: number;

    constructor(conf: AnnotationConfig) {
       super(conf);
       this.x2 = conf.x + conf.w;
    }

    public add(ann: A) {
        if (this.x > ann.x) {
            this.x = ann.x;
        }

        let annX2 = ann.x + ann.w;
        if (this.x2 < annX2) {
            this.x2 = annX2;
        }
        this.w = (this.x2 - this.x);
        this.group.push(ann);
    }

    public setY(y: number) {
        this.y = y;
        for (const ann of this.group) {
            ann.setY(y);
        }
    }
}
