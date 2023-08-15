import {fireEvent, render, screen} from "@testing-library/react";
import App from "./App.tsx";

const mockRequestToken= jest.fn().mockResolvedValue({})
jest.mock("./module/KushkiFields.ts", () =>  ({
    KushkiFields:{
      init: jest.fn().mockImplementation(() => ({
        requestToken: mockRequestToken
      }))
    }
  })
);

describe("Tests on <App/> component", () => {

  test("Kushki Fields JS - DEMO", () => {
    render(<App />);
    const h1Element = screen.getByText("Kushki Fields JS - DEMO");

    expect(h1Element).toBeDefined();
  });

  test("Kushki Fields JS - DEMO request token", () => {
    render(<App />);
    const button = screen.getByTestId('tokenRequestBtn')

    fireEvent.click(button)

    expect(mockRequestToken).toBeCalled();
  });
});
