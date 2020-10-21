import {Annotation} from "./annotation";
import {SequenceAnnotationConfig} from "./sequence-annotation-config";

interface characterDatum {
    char: string;
    x: number;
}

export class SequenceAnnotation extends Annotation {
    sequence: string;
    characters: characterDatum[] = [];

    public constructor(conf: SequenceAnnotationConfig) {
        super(conf);
        this.sequence = conf.sequence;
        let i = 0;
        for (const c of this.sequence) {
            this.characters.push({char: c, x: i++})
        }
    }
}
