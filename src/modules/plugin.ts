/**
 * A simple interface for SODA plugins. As of now, it only requires that plugins have some sort of functionality to
 * be alerted. This will probably be more fleshed out in the future.
 */
export interface Plugin {
   alert(): void;
}
