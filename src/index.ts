import { KushkiOptions } from "types/kushki_options";
import { IKushki } from "repository/IKushki.ts";
import { Kushki } from "src/Kushki.ts";

/**
 * init method
 */
const init = (options: KushkiOptions): Promise<IKushki> => Kushki.init(options);

// Main Object
export { init };
// Types
export type { KushkiOptions, IKushki };
