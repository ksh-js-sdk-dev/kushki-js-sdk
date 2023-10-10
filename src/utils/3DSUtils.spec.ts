import {
  is3dsValid,
  tokenHasAllSecurityProperties,
  tokenNotNeedsAuth
} from "utils/3DSUtils.ts";

describe("3DSUtils - test", () => {
  describe("tokenNotNeedsAuth - method", () => {
    it("should return true when token not have security props", () => {
      const response = tokenNotNeedsAuth({ token: "12345" });

      expect(response).toBeTruthy();
    });

    it("should return true when token has not need auth", () => {
      const response = tokenNotNeedsAuth({
        token: "12345",
        security: {
          authRequired: false
        }
      });

      expect(response).toBeTruthy();
    });

    it("should return false when token need auth", () => {
      const response = tokenNotNeedsAuth({
        token: "12345",
        security: {
          authRequired: true
        }
      });

      expect(response).toBeFalsy();
    });
  });

  describe("tokenHasAllSecurityProperties - method", () => {
    it("should return true if token has all security properties", () => {
      const response = tokenHasAllSecurityProperties({
        token: "12344",
        security: {
          authRequired: true,
          acsURL: ".com",
          paReq: "456",
          authenticationTransactionId: "678",
          specificationVersion: "2.0.0"
        }
      });

      expect(response).toBeTruthy();
    });

    it("should return true if token has all security properties for sandbox", () => {
      const response = tokenHasAllSecurityProperties(
        {
          token: "12344",
          security: {
            authRequired: true,
            acsURL: ".com",
            paReq: "456",
            authenticationTransactionId: "678",
            specificationVersion: "1.0.0"
          }
        },
        true
      );

      expect(response).toBeTruthy();
    });

    it("should return false if token not have version grater than 2", () => {
      const response = tokenHasAllSecurityProperties({
        token: "12344",
        security: {
          authRequired: true,
          acsURL: ".com",
          paReq: "456",
          authenticationTransactionId: "678",
          specificationVersion: "1.0.0"
        }
      });

      expect(response).toBeFalsy();
    });
  });

  describe("is3dsValid - method", () => {
    it("should return true if 3ds secureValidation is correct", () => {
      const response = is3dsValid({
        message: "3DS000",
        code: "ok"
      });

      expect(response).toBeTruthy();
    });

    it("should return true if 3ds secureValidation is correct, variation", () => {
      const response = is3dsValid({
        message: "ok",
        code: "3DS000"
      });

      expect(response).toBeTruthy();
    });

    it("should return false if 3ds secureValidation is failed", () => {
      const response = is3dsValid({
        message: "error",
        code: "3DS000"
      });

      expect(response).toBeFalsy();
    });
  });
});
