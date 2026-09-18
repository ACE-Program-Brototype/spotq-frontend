import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";

Object.assign(globalThis, { TextDecoder, TextEncoder });

if (typeof window !== "undefined" && window.URL) {
  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => "";
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }
}
