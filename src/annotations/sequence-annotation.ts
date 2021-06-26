import {Annotation, AnnotationConfig} from "./annotation";

/**
 * An enum to represent the type of a column in a sequence alignment.
 */
export enum ColumnType {
    /**
     * This represents a match in the sequence alignment.
     */
    Match = "0",
    /**
     * This represents a substitution in the sequence alignment.
     */
    Substitution = "1",
    /**
     * This represents a gap in the sequence alignment.
     */
    Gap = "2",
}

/**
 * A simple interface to represent a single character and it's relative position in a SequenceAnnotation.
 */
export interface CharacterDatum {
    /**
     * The SequenceAnnotation that this CharacterDatum belongs to.
     */
    parent: SequenceAnnotation;
    /**
     * The character.
     */
    char: string;
    /**
     * The character's semantic position relative to the SequenceAnnotation's semantic position.
     */
    x: number;
    /**
     * The type of the column in the alignment (if this CharacterDatum represents a column in a sequence alignment):
     * match, substitution or gap.
     */
    columnType?: ColumnType;
}

/**
 * A simple interface to define the arguments for the SequenceAnnotation constructor.
 */
export interface SequenceAnnotationConfig extends AnnotationConfig {
    /**
     * The sequence string to be rendered in the visualization.
     */
    sequence: string;
    /**
     * An array of ColumnTypes, which should indicate the type of each character in the sequence. This array should
     * be the same length as the sequence string.
     */
    columnTypes?: ColumnType[];
}

/**
 * An Annotation extension for annotations that are rendered as text. The general idea is that if
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
        let sequenceArray = this.sequence.split('');
        if (conf.columnTypes !== undefined) {
            if (conf.columnTypes.length !== sequenceArray.length) {
                console.error('columnTypes length mismatch on', this);
                throw('columnTypes mismatch');
            }
        }
        for (const [i, c] of this.sequence.split('').entries()) {
            if (conf.columnTypes !== undefined) {
                this.characters.push({parent: this, char: c, x: (this.x + i), columnType: conf.columnTypes[i]})
            }
            else {
                this.characters.push({parent: this, char: c, x: (this.x + i)})
            }
        }
    }
}
