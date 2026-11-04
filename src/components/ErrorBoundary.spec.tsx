import { render, screen } from "@testing-library/react";
import { datadogRum } from "@datadog/browser-rum";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

vi.mock("@datadog/browser-rum", () => ({
  datadogRum: { init: vi.fn(), addError: vi.fn(), setGlobalContextProperty: vi.fn() },
}));

const Boom = () => {
  throw new Error("boom");
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

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

  it("logs to the console instead of datadog in development", async () => {
    vi.stubEnv("MODE", "development");
    vi.resetModules();
    const { ErrorBoundary: DevBoundary } = await import("./ErrorBoundary");
    const { datadogRum: dev } = await import("@datadog/browser-rum");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <DevBoundary>
        <Boom />
      </DevBoundary>
    );
    expect(consoleError).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }));
    expect(dev.addError).not.toHaveBeenCalled();
  });
});
