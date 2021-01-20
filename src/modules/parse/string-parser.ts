import {Annotation} from "../../annotations/annotation";

/**
 * An interface that defines how a string parsing object should look.
 */
export interface StringParser<A extends Annotation> {
    // fields:     string[];
    // separator:  string;
    parseLine(line: string): A[];
}
