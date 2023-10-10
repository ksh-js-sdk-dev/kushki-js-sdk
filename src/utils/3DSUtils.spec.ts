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
        security: {
          authRequired: false
        },
        token: "12345"
      });

      expect(response).toBeTruthy();
    });

    it("should return false when token need auth", () => {
      const response = tokenNotNeedsAuth({
        security: {
          authRequired: true
        },
        token: "12345"
      });

      expect(response).toBeFalsy();
    });
  });

  describe("tokenHasAllSecurityProperties - method", () => {
    it("should return true if token has all security properties", () => {
      const response = tokenHasAllSecurityProperties({
        security: {
          acsURL: ".com",
          authenticationTransactionId: "678",
          authRequired: true,
          paReq: "456",
          specificationVersion: "2.0.0"
        },
        token: "12344"
      });

      expect(response).toBeTruthy();
    });

    it("should return true if token has all security properties for sandbox", () => {
      const response = tokenHasAllSecurityProperties(
        {
          security: {
            acsURL: ".com",
            authenticationTransactionId: "678",
            authRequired: true,
            paReq: "456",
            specificationVersion: "1.0.0"
          },
          token: "12344"
        },
        true
      );

      expect(response).toBeTruthy();
    });

    it("should return false if token not have version grater than 2", () => {
      const response = tokenHasAllSecurityProperties({
        security: {
          acsURL: ".com",
          authenticationTransactionId: "678",
          authRequired: true,
          paReq: "456",
          specificationVersion: "1.0.0"
        },
        token: "12344"
      });

      expect(response).toBeFalsy();
    });
  });

  describe("is3dsValid - method", () => {
    it("should return true if 3ds secureValidation is correct", () => {
      const response = is3dsValid({
        code: "ok",
        message: "3DS000"
      });

      expect(response).toBeTruthy();
    });

    it("should return true if 3ds secureValidation is correct, variation", () => {
      const response = is3dsValid({
        code: "3DS000",
        message: "ok"
      });

      expect(response).toBeTruthy();
    });

    it("should return false if 3ds secureValidation is failed", () => {
      const response = is3dsValid({
        code: "3DS000",
        message: "error"
      });

      expect(response).toBeFalsy();
    });
  });
});
