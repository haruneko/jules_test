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
const BEAT_WIDTH = TICKS_PER_BEAT * PIXELS_PER_TICK; // Width of a beat in pixels
const NUM_MEASURES_DISPLAY = 4; // Example: display 4 measures
const MEASURE_WIDTH = BEAT_WIDTH * 4; // Assuming 4 beats per measure

// Adjust CANVAS_WIDTH to show a certain number of measures/beats
// const DYNAMIC_CANVAS_WIDTH = MEASURE_WIDTH * NUM_MEASURES_DISPLAY;
// For now, using fixed CANVAS_WIDTH, but this could be calculated based on content.

export const PianoRoll: React.FC = () => {
  const { notes, deleteNote, updateNote } = useMusicData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw horizontal lines for note pitches
    context.strokeStyle = '#444444'; // Darker grid lines
    context.lineWidth = 0.5;
    for (let i = 0; i <= NUM_PITCHES; i++) {
      const y = i * NOTE_LANE_HEIGHT;
      // Draw thicker lines for octaves (every 12 notes, starting from C)
      if (i % 12 === 0) {
        context.lineWidth = 1;
        context.strokeStyle = '#666666';
      } else {
        context.lineWidth = 0.5;
        context.strokeStyle = '#444444';
      }
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(CANVAS_WIDTH, y);
      context.stroke();
    }

    // Draw vertical lines for beats and measures
    context.strokeStyle = '#555555';
    context.lineWidth = 0.5;
    for (let i = 0; i * BEAT_WIDTH < CANVAS_WIDTH; i++) {
      const x = i * BEAT_WIDTH;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, CANVAS_HEIGHT);
      context.stroke();
       // Measure lines (thicker)
      if (i % 4 === 0) { // Assuming 4 beats per measure
        context.strokeStyle = '#777777';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x,0);
        context.lineTo(x, CANVAS_HEIGHT);
        context.stroke();
        context.strokeStyle = '#555555'; // Reset for beat lines
      }
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
    <div style={{ border: '1px solid green', padding: '10px', overflow: 'auto', position: 'relative' }}>
      <h2 style={{ position: 'sticky', top: 0, left: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10 }}>Piano Roll Area</h2>
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
