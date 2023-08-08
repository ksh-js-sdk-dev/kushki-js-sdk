import { render, screen } from "@testing-library/react";
import App from "./App.tsx";

describe("Tests on <App/> component", () => {
  test("renders Vite + React h1", () => {
    render(<App />);
    const h1Element = screen.getByText("Vite + React");

    expect(h1Element).toBeDefined();
  });
});
