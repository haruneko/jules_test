// src/components/PianoKeyboard.tsx
import React from 'react';

const WHITE_KEY_WIDTH = 22; // px
const WHITE_KEY_HEIGHT = 120; // px
const BLACK_KEY_WIDTH = 13; // px
const BLACK_KEY_HEIGHT = 75; // px
const NUM_KEYS = 128; // MIDI notes 0-127
const C4_MIDI_NOTE = 60;

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface NoteDetails {
  name: string;
  isBlack: boolean;
  octave: number;
  noteInOctave: number; // 0 for C, 1 for C#, ..., 11 for B
}

const getNoteDetails = (midiNote: number): NoteDetails => {
  const octave = Math.floor(midiNote / 12) - 1; // MIDI note 0 is C-1
  const noteIndex = midiNote % 12;
  const name = noteNames[noteIndex];
  const isBlack = name.includes('#');
  return {
    name: `${name}${octave}`,
    isBlack,
    octave,
    noteInOctave: noteIndex,
  };
};

interface PianoKeyProps {
  details: NoteDetails;
  isHighlighted: boolean;
  left: number;
  top?: number; // Only for black keys
}

const PianoKeyDisplay: React.FC<PianoKeyProps> = ({ details, isHighlighted, left, top = 0 }) => {
  const keyStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${details.isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH}px`,
    height: `${details.isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT}px`,
    backgroundColor: details.isBlack ? 'black' : 'white',
    border: '1px solid #333',
    boxSizing: 'border-box',
    color: details.isBlack ? 'white' : 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '5px',
    fontSize: '8px',
    zIndex: details.isBlack ? 1 : 0,
    transition: 'background-color 0.1s ease', // For potential future hover effects
  };

  if (isHighlighted) {
    keyStyle.backgroundColor = 'gold'; // Highlight C4
    keyStyle.color = 'black';
  }

  // Shorten label: C#4 -> C#, C4 -> C4
  const displayLabel = details.name.length > 2 && details.isBlack ?
                       details.name.substring(0, 2) :
                       details.name;

  return (
    <div style={keyStyle} title={details.name}>
      <span>{displayLabel}</span>
    </div>
  );
};

export const PianoKeyboard: React.FC = () => {
  const whiteKeys = [];
  const blackKeys = [];
  let currentWhiteKeyLeft = 0;

  // First pass: layout white keys and create black key data
  for (let i = 0; i < NUM_KEYS; i++) {
    const details = getNoteDetails(i);
    const isHighlighted = i === C4_MIDI_NOTE;

    if (!details.isBlack) {
      whiteKeys.push(
        <PianoKeyDisplay
          key={`wk-${i}`}
          details={details}
          isHighlighted={isHighlighted}
          left={currentWhiteKeyLeft}
        />
      );
      // Prepare for black keys associated with this white key
      // C#(1), D#(3), F#(6), G#(8), A#(10)
      // Black keys are positioned relative to the white key they follow.
      // The offset is typically a bit more than half the white key's width.
      if ([0, 2, 5, 7, 9].includes(details.noteInOctave)) { // C, D, F, G, A
         // Check if the next note is within range and is black
        if (i + 1 < NUM_KEYS) {
            const nextNoteDetails = getNoteDetails(i + 1);
            if (nextNoteDetails.isBlack) {
                 blackKeys.push(
                    <PianoKeyDisplay
                        key={`bk-${i + 1}`}
                        details={nextNoteDetails}
                        isHighlighted={(i + 1) === C4_MIDI_NOTE} // Should not happen for C4
                        left={currentWhiteKeyLeft + WHITE_KEY_WIDTH - (BLACK_KEY_WIDTH / 2) -1} // Center on the line
                    />
                );
            }
        }
      }
      currentWhiteKeyLeft += WHITE_KEY_WIDTH;
    }
  }

  const totalWidth = currentWhiteKeyLeft; // Total width is based on white keys

  return (
    <div style={{ border: '1px solid blue', padding: '10px', height: `${WHITE_KEY_HEIGHT + 50}px`, position: 'relative', width: `${totalWidth}px`, margin: '20px 0', overflowX: 'auto', overflowY: 'hidden' }}>
      <h3 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Piano Keyboard</h3>
      <div style={{ position: 'relative', width: `${totalWidth}px`, height: `${WHITE_KEY_HEIGHT}px` }}>
        {whiteKeys}
        {blackKeys}
      </div>
    </div>
  );
};
