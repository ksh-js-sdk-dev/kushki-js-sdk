import { KushkiOptions } from "types/kushki_options";
import { IKushki } from "repository/IKushki.ts";
import { Kushki } from "class/Kushki.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";

/**
 * Initializes the Kushki payment gateway with the provided options.
 *
 * @param {KushkiOptions} options - The options for initializing the Kushki payment gateway.
 * @returns {Promise<IKushki>} A Promise that resolves to an instance of the initialized Kushki payment gateway.
 *
 * @typedef {Object} KushkiOptions - Options for initializing the Kushki payment gateway.
 * @property {string} apiKey - The API key for authentication with the Kushki API.
 * @property {string} environment - The environment to use (e.g., 'sandbox', 'production').
 *
 * @typedef {Object} IKushki - An interface representing the initialized Kushki payment gateway instance.
 * @property {function} processPayment - A function to process a payment transaction.
 * @property {function} refundPayment - A function to refund a payment transaction.
 * // Add more methods and properties as applicable for the IKushki interface.
 *
 * @typedef {Object} ErrorCode Throws an error if the initialization fails library.
 * @throws {ErrorCode} Throws an error if the initialization fails due to invalid options, network issues or public credential id undefined.
 *
 *  @example
 * // Example usage of the init function
 * const options = {
 *   apiKey: 'YOUR_API_KEY',
 *   environment: 'sandbox'
 * };
 *
 * init(options)
 *   .then((kushkiInstance) => {
 *     // The Kushki payment gateway is now initialized and ready to use.
 *     // You can call methods like kushkiInstance.processPayment() or kushkiInstance.refundPayment().
 *   })
 *   .catch((error) => {
 *     console.error('Error initializing Kushki:', error);
 *   });
 */
const init = (options: KushkiOptions): Promise<IKushki> => Kushki.init(options);

// Main Object
export { init };
// Types
export type { KushkiOptions, IKushki, KushkiError };
