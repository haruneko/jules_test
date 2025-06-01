// src/components/PianoKeyboard.tsx
import React from 'react';

const KEY_HEIGHT = 12; // px - Synchronized with PianoRoll's NOTE_LANE_HEIGHT
const WHITE_KEY_DEPTH = 80; // px - Visual width of white keys in vertical layout
const BLACK_KEY_DEPTH = 80; // px - Visual width of black keys, now same as white keys

const NUM_KEYS = 128; // MIDI notes 0-127
const C4_MIDI_NOTE = 60;

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface NoteDetails {
  name: string;
  isBlack: boolean;
  octave: number;
  noteInOctave: number; // 0 for C, 1 for C#, ..., 11 for B
  midiNote: number;
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
    midiNote,
  };
};

interface PianoKeyDisplayProps {
  details: NoteDetails;
  isHighlighted: boolean;
  style: React.CSSProperties;
}

const PianoKeyDisplay: React.FC<PianoKeyDisplayProps> = ({ details, isHighlighted, style }) => {
  const keyStyle: React.CSSProperties = {
    ...style,
    backgroundColor: details.isBlack ? 'black' : 'white',
    borderLeft: '1px solid #333',
    borderRight: '1px solid #333',
    borderTop: '1px solid #333', // Default top border for all keys
    borderBottom: details.isBlack ? '1px solid #333' : '1px solid #ccc', // Thinner bottom border for white keys
    boxSizing: 'border-box',
    color: details.isBlack ? 'white' : 'black',
    display: 'flex',
    // For vertical keys, align items to the left/start, justify content to center or start
    flexDirection: 'row', // Labels next to keys or inside, adjust as needed
    justifyContent: 'center', // Center label horizontally
    alignItems: 'center', // Center label vertically
    paddingLeft: '5px', // Padding for the label
    fontSize: '10px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    zIndex: details.isBlack ? 1 : 0,
    transition: 'background-color 0.1s ease',
  };

  if (isHighlighted) {
    keyStyle.backgroundColor = 'gold';
    keyStyle.color = 'black';
  }

  // Adjust label for very short keys if necessary, or consider other placement
  const displayLabel = details.name; // Using full name for now

  return (
    <div style={keyStyle} title={details.name}>
      <span>{displayLabel}</span>
    </div>
  );
};

export const PianoKeyboard: React.FC = () => {
  const keysToRender = [];
  // let currentWhiteKeyTop = 0; // This variable was unused

  // Iterate from 127 down to 0 for vertical layout (127 at top)
  for (let i = NUM_KEYS -1 ; i >= 0; i--) {
    const details = getNoteDetails(i);
    const isHighlighted = i === C4_MIDI_NOTE;

    const keySpecificStyle: React.CSSProperties = {
      position: 'absolute',
      height: `${KEY_HEIGHT}px`,
      left: `0px`, // White keys start at left edge
    };

    if (details.isBlack) {
      keySpecificStyle.width = `${BLACK_KEY_DEPTH}px`;
      // Black keys are positioned relative to the white key *below* them in pitch (visually above or at same start)
      // The 'top' is determined by the pitch.
      // MIDI note 127 is at top: 0 * KEY_HEIGHT
      // MIDI note 126 is at: 1 * KEY_HEIGHT
      // MIDI note i is at: (NUM_KEYS - 1 - i) * KEY_HEIGHT
      keySpecificStyle.top = `${(NUM_KEYS - 1 - i) * KEY_HEIGHT}px`;
      // Offset black keys slightly to the right, but they don't "overlap" in the same way as horizontal.
      // They are typically inset. For now, let's place them at the same left edge but with different width.
      // A common vertical style is to have black keys narrower and starting at the same horizontal line as white keys.
      // Or, they could be visually "on top" if white keys are made narrower.
    // For simplicity, black keys will have the same depth and start at same horizontal origin.
    // Their zIndex and color will differentiate them.
    keySpecificStyle.zIndex = 1;
    } else {
      // White keys
      keySpecificStyle.width = `${WHITE_KEY_DEPTH}px`;
      keySpecificStyle.top = `${(NUM_KEYS - 1 - i) * KEY_HEIGHT}px`;
    }

    keysToRender.push(
      <PianoKeyDisplay
        key={i}
        details={details}
        isHighlighted={isHighlighted}
        style={keySpecificStyle}
      />
    );
  }

  const totalKeyboardHeight = NUM_KEYS * KEY_HEIGHT;
  const totalKeyboardWidth = WHITE_KEY_DEPTH; // Dominated by white key depth

  return (
    <div style={{ border: '1px solid blue', /* padding: '5px', */ height: `${totalKeyboardHeight}px`, width: `${totalKeyboardWidth}px`, position: 'relative', margin: '0', overflowY: 'auto', overflowX: 'hidden' }}>
      {/* Title h3 element removed */}
      {/* Container size adjusted to remove padding allowance */}
      <div style={{ position: 'relative', width: `${totalKeyboardWidth}px`, height: `${totalKeyboardHeight}px` }}>
        {keysToRender}
      </div>
    </div>
  );
};
