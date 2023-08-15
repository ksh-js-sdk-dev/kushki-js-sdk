import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { KushkiFields } from "../module/services/KushkiFields";
import { CheckoutContainer } from "./Checkout";

const mockRequestToken = jest.fn().mockResolvedValue({});

const mockKushkiFieldsInit = jest.fn().mockResolvedValue({
  requestToken: mockRequestToken
});

describe("Tests on <CheckoutContainer/> component", () => {
  beforeEach(() => {
    KushkiFields.init = mockKushkiFieldsInit;
  });

  test("Kushki Fields JS - DEMO", () => {
    render(<CheckoutContainer />);
    const h1Element = screen.getByText("Kushki Fields JS - DEMO");

    expect(h1Element).toBeDefined();
  });

  test("Kushki Fields JS - DEMO request token", async () => {
    render(<CheckoutContainer />);

    await waitFor(() => {
      const button = screen.getByTestId("tokenRequestBtn");

      fireEvent.click(button);

      expect(mockRequestToken).toHaveBeenCalledTimes(1);
    });
  });
});
