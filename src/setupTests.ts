import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

// jsdom has no canvas; react-color's checkboard calls getContext.
HTMLCanvasElement.prototype.getContext = (() => null) as never;
