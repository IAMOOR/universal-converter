import { test, expect, describe } from "bun:test";
import * as ReactDOMServer from "react-dom/server";
import * as React from "react";
import App from "./App.tsx";

describe("App", () => {
  test("renders correctly and displays basic converter UI", () => {
    const html = ReactDOMServer.renderToString(<App />);

    // Test basic categories presence
    expect(html).toContain("Weight");
    expect(html).toContain("Length");
    expect(html).toContain("Volume");
    expect(html).toContain("Temperature");
    expect(html).toContain("Currency");

    // Test default value
    expect(html).toContain('value="1"');
  });
});
