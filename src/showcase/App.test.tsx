import { render } from "@testing-library/react";
import App from "./App.tsx";

describe("Tests on <App/> component", () => {
  test("renders Vite + React h1", () => {
    render(<App />);
  });
});
