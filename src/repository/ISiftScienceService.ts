/**
 * Interface Sift Science Service file.
 */
import { SiftScienceAntiFraudSessionResponse } from "types/sift_science_session";
import { Kushki } from "Kushki";

export interface ISiftScienceService {
  /**
   *  create createSiftScienceSession
   */
  createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    kushkiInstance: Kushki
  ): Promise<SiftScienceAntiFraudSessionResponse>;
}
