import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";

Object.assign(globalThis, { TextDecoder, TextEncoder });

if (typeof window !== "undefined") {
  if (window.URL) {
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = () => "";
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = () => {};
    }
  }
  if (!window.PointerEvent) {
    class PointerEvent extends MouseEvent {
      pointerId = 0;
      width = 1;
      height = 1;
      pressure = 0;
      tangentialPressure = 0;
      tiltX = 0;
      tiltY = 0;
      twist = 0;
      pointerType = "mouse";
      isPrimary = false;
    }
    // @ts-expect-error polyfill for jsdom
    window.PointerEvent = PointerEvent;
  }
}
