import {Annotation, AnnotationConfig} from "./annotation";

/**
 * @hidden
 * A simple interface to represent a single character and it's relative position in a SequenceAnnotation
 */
export interface CharacterDatum {
    /**
     * The character.
     */
    char: string;
    /**
     * The character's semantic position relative to the SequenceAnnotation's semantic position.
     */
    x: number;
}

/**
 * @hidden
 * A simple interface to define the arguments for the SequenceAnnotation constructor.
 */
export interface SequenceAnnotationConfig extends AnnotationConfig {
    sequence: string;
}

/**
 * @hidden
 * An experimental interface to define an Annotation that is rendered entirely as text. The general idea is that if
 * an Annotation represents a sequence alignment, each character in the query sequence can be rendered at the
 * semantic chromosome position that it was aligned to. This works, but it's far from optimized and will likely
 * cause performance issues.
 */
export class SequenceAnnotation extends Annotation {
    /**
     * The sequence string to be rendered in the visualization.
     */
    sequence: string;
    /**
     * A list of objects to store the semantic coordinates of each character in the sequence.
     */
    characters: CharacterDatum[] = [];

    public constructor(conf: SequenceAnnotationConfig) {
        super(conf);
        this.sequence = conf.sequence;
        let i = 0;
        for (const c of this.sequence) {
            this.characters.push({char: c, x: (this.x + i++)})
        }
    }
}
