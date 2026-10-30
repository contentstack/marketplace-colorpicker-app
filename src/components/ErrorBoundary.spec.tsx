import { render, screen } from "@testing-library/react";
import { datadogRum } from "@datadog/browser-rum";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

vi.mock("@datadog/browser-rum", () => ({
  datadogRum: { init: vi.fn(), addError: vi.fn(), setGlobalContextProperty: vi.fn() },
}));

const Boom = () => {
  throw new Error("boom");
};

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>fine</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("fine")).toBeInTheDocument();
  });

  it("shows the fallback and reports the error when a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(datadogRum.addError).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }));
  });
});
