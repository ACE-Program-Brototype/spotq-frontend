import { ringMedia } from "./ring-sound.utils";

describe("ringMedia utility", () => {
  const originalAudioContext = window.AudioContext;
  const originalVibrate = navigator.vibrate;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.AudioContext = originalAudioContext;
    navigator.vibrate = originalVibrate;
  });

  describe("playAlarmSound and playChime", () => {
    it("creates oscillators and schedules multi-tone alarm without throwing", () => {
      const mockSetValueAtTime = jest.fn();
      const mockLinearRampToValueAtTime = jest.fn();
      const mockExponentialRampToValueAtTime = jest.fn();
      const mockConnect = jest.fn();
      const mockStart = jest.fn();
      const mockStop = jest.fn();
      const mockResume = jest.fn().mockResolvedValue(undefined);

      const mockGainNode = {
        gain: {
          setValueAtTime: mockSetValueAtTime,
          linearRampToValueAtTime: mockLinearRampToValueAtTime,
          exponentialRampToValueAtTime: mockExponentialRampToValueAtTime,
          cancelScheduledValues: jest.fn(),
        },
        connect: mockConnect,
      };

      const mockOscillatorNode = {
        frequency: {
          setValueAtTime: mockSetValueAtTime,
        },
        connect: mockConnect,
        start: mockStart,
        stop: mockStop,
        disconnect: jest.fn(),
        type: "sine",
      };

      const MockAudioContext = jest.fn().mockImplementation(() => ({
        currentTime: 0,
        state: "suspended",
        destination: {},
        createOscillator: jest.fn().mockReturnValue(mockOscillatorNode),
        createGain: jest.fn().mockReturnValue(mockGainNode),
        resume: mockResume,
      }));

      Object.defineProperty(window, "AudioContext", {
        writable: true,
        value: MockAudioContext,
      });

      expect(() => ringMedia.playAlarmSound({ durationSeconds: 3.0 })).not.toThrow();
      expect(mockResume).toHaveBeenCalled();
      expect(mockStart).toHaveBeenCalled();
      expect(mockStop).toHaveBeenCalled();
    });

    it("handles autoplay restriction rejection gracefully", () => {
      Object.defineProperty(window, "AudioContext", {
        writable: true,
        value: jest.fn().mockImplementation(() => {
          throw new Error("Autoplay is forbidden");
        }),
      });

      expect(() => ringMedia.playAlarmSound()).not.toThrow();
    });

    it("stops ongoing alarm sounds when stopSound is called", () => {
      expect(() => ringMedia.stopSound()).not.toThrow();
      expect(() => ringMedia.stopAll()).not.toThrow();
    });
  });

  describe("triggerVibration and stopVibration", () => {
    it("calls navigator.vibrate with pattern", () => {
      const mockVibrate = jest.fn();
      navigator.vibrate = mockVibrate;

      ringMedia.triggerVibration([100, 50, 100]);
      expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100]);
    });

    it("calls navigator.vibrate(0) when stopping vibration", () => {
      const mockVibrate = jest.fn();
      navigator.vibrate = mockVibrate;

      ringMedia.stopVibration();
      expect(mockVibrate).toHaveBeenCalledWith(0);
    });

    it("handles environments without vibrate support gracefully", () => {
      // @ts-expect-error Deleting vibrate to simulate iOS Safari
      delete navigator.vibrate;

      expect(() => ringMedia.triggerVibration()).not.toThrow();
      expect(() => ringMedia.stopVibration()).not.toThrow();
    });
  });
});
