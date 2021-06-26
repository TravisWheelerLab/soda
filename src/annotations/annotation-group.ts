import {Annotation, AnnotationConfig} from "./annotation";

/**
 * A simple interface that holds the arguments for an AnnotationGroup constructor.
 */
export interface AnnotationGroupConfig<A extends Annotation> extends AnnotationConfig {
    /**
     * A list of Annotations to initially fill the group with.
     */
    group?: A[];
}

/**
 * An Annotation class that contains a group of Annotations. Mostly, this is used to maintain the group of
 * Annotations at the same vertical position--all Annotations in the group will be set to the same y coordinate
 * when the setY() method is called on the AnnotationGroup.
 * @typeParam A The type of annotation that will live in this group.
 */
export class AnnotationGroup<A extends Annotation> extends Annotation {
    /**
     * The group of Annotations that live in this object.
     */
    group: A[] = [];
    x2: number;

    constructor(conf: AnnotationGroupConfig<A>) {
        super(conf);
        this.x2 = conf.x + conf.w;

        if (conf.group !== undefined) {
            for (const ann of conf.group) {
                this.add(ann);
            }
        }
    }

    /**
     * Add an Annotation to the group.
     * @param ann The Annotation to be added.
     */
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

    /**
     * This sets the y parameter of each Annotation present in the group.
     * @param y The y value to set.
     */
    public setY(y: number) {
        this.y = y;
        for (const ann of this.group) {
            ann.setY(y);
        }
    }
}
