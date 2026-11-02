/**
 * Audio and Vibration utilities for customer ring alert notifications.
 *
 * Uses the Web Audio API to synthesize a melodic, high-priority restaurant pager ring
 * (playing 3-5 seconds of attention-grabbing chimes) and the Navigator Vibration API.
 */

export interface RingSoundConfig {
  /** Total duration of the alert ring in seconds (default: 4.5 seconds) */
  durationSeconds?: number;
  /** Peak volume between 0.0 (silent) and 1.0 (loud) (default: 0.25) */
  volume?: number;
}

class RingMediaController {
  private audioCtx: AudioContext | null = null;
  private activeGains: GainNode[] = [];
  private activeOscillators: OscillatorNode[] = [];
  private ringTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Initializes or resumes the AudioContext safely.
   */
  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtxClass) return null;

      if (!this.audioCtx || this.audioCtx.state === "closed") {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume().catch(() => {});
      }

      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Plays a high-priority, melodic pager ring lasting 4 to 5 seconds.
   * Consists of repeating dual-tone chime bursts (e.g., chime at 0s, 1.3s, 2.6s, 3.9s).
   * Automatically stops after the duration or immediately when stopSound() is called.
   */
  public playAlarmSound(config?: RingSoundConfig): void {
    const ctx = this.getContext();
    if (!ctx) return;

    // Stop any previously playing sound before starting new alert
    this.stopSound();

    const volume = config?.volume ?? 0.25;
    const duration = config?.durationSeconds ?? 4.5;
    const burstInterval = 1.2; // seconds between each chime burst
    const totalBursts = Math.floor(duration / burstInterval) + 1;

    try {
      const startTime = ctx.currentTime;

      for (let burst = 0; burst < totalBursts; burst++) {
        const burstOffset = burst * burstInterval;
        if (burstOffset >= duration) break;

        const burstTime = startTime + burstOffset;

        // Note 1: E5 (659.25 Hz)
        this.scheduleTone(ctx, 659.25, burstTime, 0.45, volume);

        // Note 2: B5 (987.77 Hz) - Bright, ringing fifth
        this.scheduleTone(ctx, 987.77, burstTime + 0.12, 0.55, volume * 1.1);

        // Note 3: E6 (1318.51 Hz) - Radiant octave accent
        this.scheduleTone(ctx, 1318.51, burstTime + 0.24, 0.65, volume * 0.9);
      }

      // Auto-cleanup references when alarm duration finishes
      this.ringTimeoutId = setTimeout(() => {
        this.stopSound();
      }, duration * 1000);
    } catch {
      // Autoplay blocked by user-agent policy; non-blocking fallback
    }
  }

  /**
   * Helper to schedule an individual synthesized tone with exponential volume dampening.
   */
  private scheduleTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    decayDuration: number,
    peakVolume: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, startTime);

    // ADSR Envelope: Fast attack, natural exponential decay
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + decayDuration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + decayDuration);

    this.activeOscillators.push(osc);
    this.activeGains.push(gain);
  }

  /**
   * Legacy alias: maintains backwards compatibility.
   */
  public playChime(config?: RingSoundConfig): void {
    this.playAlarmSound(config);
  }

  /**
   * Immediately silences the alarm sound and resets active audio nodes.
   */
  public stopSound(): void {
    if (this.ringTimeoutId) {
      clearTimeout(this.ringTimeoutId);
      this.ringTimeoutId = null;
    }

    if (this.audioCtx) {
      const now = this.audioCtx.currentTime;
      for (const gain of this.activeGains) {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(0.0001, now);
        } catch {}
      }
    }

    for (const osc of this.activeOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    }

    this.activeOscillators = [];
    this.activeGains = [];
  }

  /**
   * Triggers device vibration pattern on supported mobile browsers.
   * Repeats vibration pulses for ~4 seconds to match the alarm sound.
   */
  public triggerVibration(pattern: number[] = [300, 200, 300, 200, 500, 300, 300, 200, 500]): void {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Suppress errors on unsupported or permissions-denied contexts
      }
    }
  }

  /**
   * Immediately stops any ongoing device vibration.
   */
  public stopVibration(): void {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch {}
    }
  }

  /**
   * Convenience helper to stop both sound and vibration at once.
   */
  public stopAll(): void {
    this.stopSound();
    this.stopVibration();
  }
}

export const ringMedia = new RingMediaController();
