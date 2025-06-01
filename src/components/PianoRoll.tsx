// src/components/PianoRoll.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useMusicData } from '../contexts/MusicDataContext';
import { Note as NoteType } from '../types/music';
import { NoteComponent as NoteDisplay } from './Note'; // Renamed to avoid conflict

// Constants for rendering notes and canvas grid.
// These should be consistent.
const CANVAS_WIDTH = 1600; // Example width, can be dynamic
const NOTE_LANE_HEIGHT = 12; // Height for each note lane (pitch)
const NUM_PITCHES = 128; // MIDI pitch range 0-127
const CANVAS_HEIGHT = NUM_PITCHES * NOTE_LANE_HEIGHT;

const PIXELS_PER_TICK = 0.1; // Determines horizontal scale of notes
const TICKS_PER_BEAT = 480; // Standard ticks per beat, for visual grid reference
// const BEAT_WIDTH = TICKS_PER_BEAT * PIXELS_PER_TICK; // Width of a beat in pixels // Unused
// const NUM_MEASURES_DISPLAY = 4; // Example: display 4 measures // Unused
// const MEASURE_WIDTH = BEAT_WIDTH * 4; // Assuming 4 beats per measure // Unused

// Adjust CANVAS_WIDTH to show a certain number of measures/beats
// const DYNAMIC_CANVAS_WIDTH = MEASURE_WIDTH * NUM_MEASURES_DISPLAY;
// For now, using fixed CANVAS_WIDTH, but this could be calculated based on content.

// Default fallback colors if CSS variables are not found (though they should be)
const DEFAULT_WHITE_LANE_BG = '#FFFFFF';
const DEFAULT_BLACK_LANE_BG = '#f0f0f0';
const DEFAULT_PITCH_LINE = '#e0e0e0';
const DEFAULT_OCTAVE_LINE = '#b0b0b0';
const DEFAULT_BEAT_LINE = '#dcdcdc';
const DEFAULT_MEASURE_LINE = '#aaaaaa';

export const PianoRoll: React.FC = () => {
  const { notes, deleteNote, updateNote } = useMusicData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const computedStyles = getComputedStyle(canvas);
    const whiteKeyLaneBg = computedStyles.getPropertyValue('--proll-white-key-lane-bg').trim() || DEFAULT_WHITE_LANE_BG;
    const blackKeyLaneBg = computedStyles.getPropertyValue('--proll-black-key-lane-bg').trim() || DEFAULT_BLACK_LANE_BG;
    const pitchLineColor = computedStyles.getPropertyValue('--proll-pitch-line-color').trim() || DEFAULT_PITCH_LINE;
    const octaveLineColor = computedStyles.getPropertyValue('--proll-octave-line-color').trim() || DEFAULT_OCTAVE_LINE;
    const beatLineColor = computedStyles.getPropertyValue('--proll-beat-line-color').trim() || DEFAULT_BEAT_LINE;
    const measureLineColor = computedStyles.getPropertyValue('--proll-measure-line-color').trim() || DEFAULT_MEASURE_LINE;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw lane backgrounds (white and black keys)
    for (let pitch = 0; pitch < NUM_PITCHES; pitch++) {
      const y = (NUM_PITCHES - 1 - pitch) * NOTE_LANE_HEIGHT;
      const noteInOctave = pitch % 12;
      const isBlackKey = [1, 3, 6, 8, 10].includes(noteInOctave);

      context.fillStyle = isBlackKey ? blackKeyLaneBg : whiteKeyLaneBg;
      context.fillRect(0, y, CANVAS_WIDTH, NOTE_LANE_HEIGHT);
    }

    // 2. Draw horizontal lines for note pitches
    for (let i = 0; i <= NUM_PITCHES; i++) { // Iterate to draw NUM_PITCHES + 1 lines
      const y = i * NOTE_LANE_HEIGHT;
      const pitchAtLineBottom = NUM_PITCHES - i;
      const isOctaveLine = pitchAtLineBottom % 12 === 0;

      if (isOctaveLine && i !== NUM_PITCHES && i !== 0) {
        context.strokeStyle = octaveLineColor;
        context.lineWidth = 1;
      } else {
        context.strokeStyle = pitchLineColor;
        context.lineWidth = 0.5;
      }

      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(CANVAS_WIDTH, y);
      context.stroke();
    }
     // Re-draw canvas border explicitly
    context.strokeStyle = measureLineColor;
    context.lineWidth = 1;
    context.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    // 3. Draw vertical lines for beats and measures
    context.lineWidth = 0.5;
    for (let currentTick = 0; currentTick * PIXELS_PER_TICK < CANVAS_WIDTH; currentTick += TICKS_PER_BEAT) {
      const x = currentTick * PIXELS_PER_TICK;
      const isMeasureLine = (currentTick / TICKS_PER_BEAT) % 4 === 0;

      context.strokeStyle = isMeasureLine ? measureLineColor : beatLineColor;
      context.lineWidth = isMeasureLine ? 1 : 0.5;

      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, CANVAS_HEIGHT);
      context.stroke();
    }
  }, []); // Only draw grid once or if dimensions change (not handled here)

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  const handleUpdateLyric = (noteId: string, newLyric: string) => {
    updateNote(noteId, { lyric: newLyric });
  };

  const notesArray = Array.from(notes.values());

  return (
    <div style={{ border: '1px solid green', /* padding: '10px', */ overflow: 'auto', position: 'relative' }}>
      {/* <h2 style={{ position: 'sticky', top: 0, left: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10 }}>Piano Roll Area</h2> */}
      <div style={{ position: 'relative', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ border: '1px solid black', position: 'absolute', top: 0, left: 0 }}
          onClick={() => setSelectedNoteId(null)} // Click on canvas background deselects notes
          role="graphics-canvas" // Added for accessibility and testing
        />
        <div className="notes-container" style={{ position: 'absolute', top: 0, left: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          {notesArray.map((note: NoteType) => {
            const x = note.tick * PIXELS_PER_TICK;
            // MIDI pitch 0 is typically at the top or bottom. Let's make higher pitches go upwards (lower y).
            // So, y = (MAX_PITCH - pitch) * NOTE_LANE_HEIGHT
            // If pitch 0 is top, y = pitch * NOTE_LANE_HEIGHT
            // Given canvas origin is top-left, pitch 127 should be at y=0, pitch 0 at y = (127 * NOTE_LANE_HEIGHT)
            // Or more naturally, pitch 0 at the bottom: y = (NUM_PITCHES - 1 - note.pitch) * NOTE_LANE_HEIGHT
            const y = (NUM_PITCHES - 1 - note.pitch) * NOTE_LANE_HEIGHT;
            const noteWidth = note.duration * PIXELS_PER_TICK;
            const noteHeight = NOTE_LANE_HEIGHT;

            // Basic visibility culling (optional, but good for performance with many notes)
            // if (x > CANVAS_WIDTH || x + noteWidth < 0 || y > CANVAS_HEIGHT || y + noteHeight < 0) {
            //   return null;
            // }

            return (
              <NoteDisplay
                key={note.id}
                note={note}
                x={x}
                y={y}
                width={noteWidth}
                height={noteHeight}
                isSelected={note.id === selectedNoteId}
                onSelect={handleSelectNote}
                onDelete={handleDeleteNote}
                onUpdateLyric={handleUpdateLyric}
                // Pass other necessary props like zIndex if needed for overlapping notes
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
