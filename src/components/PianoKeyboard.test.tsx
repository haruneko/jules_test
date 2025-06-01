// src/components/PianoKeyboard.test.tsx
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PianoKeyboard } from './PianoKeyboard';

// Updated constants to reflect vertical layout and new dimensions
const KEY_HEIGHT = 12; // px
const WHITE_KEY_DEPTH = 80; // px
const BLACK_KEY_DEPTH = 80; // px (now same as white key depth)
const NUM_KEYS = 128;
const C4_MIDI_NOTE = 60;

// Helper to get note details, simplified or imported if possible
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const getNoteDetails = (midiNote: number) => {
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;
  const name = noteNames[noteIndex];
  const isBlack = name.includes('#');
  return {
    name: `${name}${octave}`,
    isBlack,
  };
};

describe('PianoKeyboard', () => {
  test('renders all 128 keys', () => {
    render(<PianoKeyboard />);
    // White keys + Black keys.
    // The component renders white keys and black keys as separate collections of divs,
    // each with its own logic for counting.
    // Let's count how many white keys there are:
    let whiteKeyCount = 0;
    for (let i = 0; i < NUM_KEYS; i++) {
      if (!getNoteDetails(i).isBlack) {
        whiteKeyCount++;
      }
    }
    // All keys are rendered as divs with a title attribute being the note name
    const allKeyElements = screen.getAllByTitle(/^[A-G]#?[0-9-]/); // Matches C4, C#-1, G8 etc.
    expect(allKeyElements.length).toBe(NUM_KEYS);
  });

  test('highlights C4 (MIDI note 60)', () => {
    render(<PianoKeyboard />);
    const c4Details = getNoteDetails(C4_MIDI_NOTE); // C4
    const c4Key = screen.getByTitle(c4Details.name);
    // Highlighted keys have a 'gold' background color
    expect(c4Key).toHaveStyle('background-color: gold');
  });

  test('displays correct note names for sample keys', () => {
    render(<PianoKeyboard />);

    const c4Details = getNoteDetails(C4_MIDI_NOTE); // C4
    expect(screen.getByTitle(c4Details.name)).toBeInTheDocument();
    // Check for the shortened label inside the key
    expect(screen.getByText(c4Details.name)).toBeInTheDocument();


    const a4Details = getNoteDetails(69); // A4
    expect(screen.getByTitle(a4Details.name)).toBeInTheDocument();
    expect(screen.getByText(a4Details.name)).toBeInTheDocument();

    const cs5Details = getNoteDetails(73); // C#5
    const cs5KeyElement = screen.getByTitle(cs5Details.name);
    expect(cs5KeyElement).toBeInTheDocument();
    // Component now displays full label for black keys as well
    expect(within(cs5KeyElement).getByText(cs5Details.name)).toBeInTheDocument();
  });

  test('distinguishes between black and white keys by style', () => {
    render(<PianoKeyboard />);
    const c4Details = getNoteDetails(C4_MIDI_NOTE); // C4 (white)
    const c4Key = screen.getByTitle(c4Details.name); // C4 is a white key
    expect(c4Key).toHaveStyle('background-color: gold'); // C4 is highlighted
    expect(c4Key).toHaveStyle(`height: ${KEY_HEIGHT}px`);
    expect(c4Key).toHaveStyle(`width: ${WHITE_KEY_DEPTH}px`);
    expect(c4Key).toHaveStyle('border-left: 1px solid #333');
    expect(c4Key).toHaveStyle('border-right: 1px solid #333');
    expect(c4Key).toHaveStyle('border-top: 1px solid #333');
    expect(c4Key).toHaveStyle('border-bottom: 1px solid #ccc'); // Specific white key bottom border

    const d4Details = getNoteDetails(62); // D4 (another white key, not highlighted)
    const d4Key = screen.getByTitle(d4Details.name);
    expect(d4Key).toHaveStyle('background-color: white');
    expect(d4Key).toHaveStyle(`height: ${KEY_HEIGHT}px`);
    expect(d4Key).toHaveStyle(`width: ${WHITE_KEY_DEPTH}px`);
    expect(d4Key).toHaveStyle('border-bottom: 1px solid #ccc');

    const cs4Details = getNoteDetails(61); // C#4 (black key)
    const cs4Key = screen.getByTitle(cs4Details.name);
    expect(cs4Key).toHaveStyle('background-color: black');
    expect(cs4Key).toHaveStyle(`height: ${KEY_HEIGHT}px`);
    expect(cs4Key).toHaveStyle(`width: ${BLACK_KEY_DEPTH}px`); // Now same as white key depth
    expect(cs4Key).toHaveStyle('border-bottom: 1px solid #333'); // Black keys have the standard #333 bottom border
    expect(cs4Key).toHaveStyle('z-index: 1');
  });
});
