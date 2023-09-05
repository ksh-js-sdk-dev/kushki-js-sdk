import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
  waitFor
} from "@testing-library/react";
import { Kushki, TokenResponse } from "kushki-js-sdk";
import { Card, CardOptions } from "kushki-js-sdk/card";

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

const mockRequestToken =  jest.fn().mockResolvedValue({
  token: "replace by token response"
})

const mockInitCardToken = jest.fn().mockResolvedValue(
    {
      requestToken: mockRequestToken
    }
)

describe("Tests on <CheckoutContainer/> component", () => {
  beforeEach(() => {
    cleanup();
    (Kushki.init as jest.Mock).mockResolvedValue({});
    Card.initCardToken = mockInitCardToken
  });

  test("Kushki Fields JS - DEMO", async () => {
    await act(async () => {
      render(<CheckoutContainer />);
    });

    const h1Element = screen.getByText("Kushki Fields JS - DEMO");

    expect(h1Element).toBeDefined();
    expect(mockInitCardToken).toHaveBeenCalled();
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
    expect(mockRequestToken).toHaveBeenCalled();
  });
});
