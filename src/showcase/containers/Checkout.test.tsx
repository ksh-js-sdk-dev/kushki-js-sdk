import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react";
import { KushkiFields, requestToken } from "KFields";
import { CheckoutContainer } from "./Checkout.tsx";

jest.mock('KFields"', () => {
  return {
    requestToken: jest.fn(),
    KushkiFields: {
      init: jest.fn()
    }
  };
});

describe("Tests on <CheckoutContainer/> component", () => {
  beforeEach(() => {
    cleanup();
    (KushkiFields.init as jest.Mock).mockResolvedValue({});
    (requestToken as jest.Mock).mockResolvedValue({
      token: "replace by token response"
    });
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

      const label = screen.getByTestId("token");

      expect(label).toBeDefined();
    });
  });
});
