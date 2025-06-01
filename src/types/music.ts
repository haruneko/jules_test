// src/types/music.ts

/**
 * Represents a musical note.
 */
export interface Note {
  id: string; // Unique identifier
  tick: number; // Start time in ticks
  pitch: number; // MIDI note number (0-127)
  duration: number; // Duration in ticks
  lyric: string; // Lyric for the note
  vel: number; // Velocity (0-127, placeholder)
  gen: number; // GEN parameter (placeholder, specific range/meaning TBD)
}

/**
 * Represents a time signature change event.
 */
export interface TimeSignatureEvent {
  id: string; // Unique identifier
  tick: number; // Time in ticks where the time signature changes
  numerator: number; // Numerator of the time signature (e.g., 4 for 4/4)
  denominator: number; // Denominator of the time signature (e.g., 4 for 4/4)
}

/**
 * Represents a tempo change event.
 */
export interface TempoEvent {
  id: string; // Unique identifier
  tick: number; // Time in ticks where the tempo changes
  bpm: number; // Beats Per Minute
}

/**
 * Represents a control curve.
 * The actual data points will be handled elsewhere as per requirements.
 */
export interface ControlCurve {
  id:string; // Unique identifier for the curve
  name: string; // Name of the control parameter (e.g., "PitchBend", "Volume")
  // Points will be a map of tick to value, e.g., Map<number, number>
  // For now, we'll just define the structure, detailed implementation is not required yet.
  points: Map<number, number>;
}
