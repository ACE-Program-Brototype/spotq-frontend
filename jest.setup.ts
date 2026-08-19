import { TextDecoder, TextEncoder } from "node:util";
import "@testing-library/jest-dom";

// Polyfill TextEncoder / TextDecoder for react-router v7 in jsdom
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}
