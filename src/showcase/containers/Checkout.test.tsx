import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
  waitFor
} from "@testing-library/react";
import { Kushki } from "Kushki";
import { Card } from "Kushki/card";

import { CheckoutContainer } from "./Checkout.tsx";

jest.mock("Kushki", () => {
  return {
    Kushki: {
      init: jest.fn()
    }
  };
});

jest.mock("Kushki/card", () => {
  return {
    Card: {
      initCardToken: jest.fn()
    }
  };
});

describe("Tests on <CheckoutContainer/> component", () => {
  beforeEach(() => {
    cleanup();
    (Kushki.init as jest.Mock).mockResolvedValue({});
    (Card.initCardToken as jest.Mock).mockResolvedValue({
      requestToken: jest.fn().mockResolvedValue({
        token: "replace by token response"
      })
    });
  });

  test("Kushki Fields JS - DEMO", async () => {
    await act(async () => {
      render(<CheckoutContainer />);
    });

    const h1Element = screen.getByText("Kushki Fields JS - DEMO");

    expect(h1Element).toBeDefined();
  });

  test("Kushki Fields JS - DEMO request token", async () => {
    await act(async () => {
      render(<CheckoutContainer />);
    });

    const button = screen.getByTestId("tokenRequestBtn");

    act(() => {
      fireEvent.click(button);
    });

    const label = await waitFor(() => screen.getByTestId("token"));
    expect(label).toBeDefined();
  });
});
