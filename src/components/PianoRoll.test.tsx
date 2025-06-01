// src/components/PianoRoll.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

import { PianoRoll } from './PianoRoll';
import { Note as NoteType } from '../types/music';
import { MusicDataContextType, useMusicData } from '../contexts/MusicDataContext';

// Import the component to be mocked. After vi.mock, this will be the mock itself.
import { NoteComponent } from './Note';

// Mock the './Note' module.
// The factory function defines the mock implementation.
vi.mock('./Note', async (importOriginal) => {
  const actual = await importOriginal() as any; // Import actual if needed for passthrough
  return {
    ...actual, // Spread actual module exports if you want to mock only specific parts
    __esModule: true,
    NoteComponent: vi.fn(({ note, isSelected, onSelect, onDelete }) => (
      <div
        data-testid={`note-${note.id}`}
        data-selected={isSelected}
        onClick={() => onSelect(note.id)}
        onKeyDown={(e) => {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            onDelete(note.id);
          }
        }}
        tabIndex={0}
        role="button"
      >
        {note.lyric || `P:${note.pitch}`}
      </div>
    )),
  };
});

// Cast the imported NoteComponent to its mocked type (Vitest.MockedFunction)
// This allows us to use .mockClear(), .toHaveBeenCalledTimes(), etc.
const MockedNoteComponent = NoteComponent as ReturnType<typeof vi.fn>;

// Mock window.getComputedStyle
const mockGetPropertyValue = vi.fn();
const mockGetComputedStyle = vi.fn(() => ({
  getPropertyValue: mockGetPropertyValue,
}));
global.window.getComputedStyle = mockGetComputedStyle;

// Define mock return values for CSS custom properties
const MOCK_PROLL_WHITE_KEY_LANE_BG = '#FDFDFD'; // Slightly off-white for testing
const MOCK_PROLL_BLACK_KEY_LANE_BG = '#EFEFEF';
const MOCK_PROLL_PITCH_LINE_COLOR = '#D0D0D0';
const MOCK_PROLL_OCTAVE_LINE_COLOR = '#A0A0A0';
const MOCK_PROLL_BEAT_LINE_COLOR = '#C8C8C8';
const MOCK_PROLL_MEASURE_LINE_COLOR = '#909090';


const initialMockNotes = new Map<string, NoteType>([
  ['note1', { id: 'note1', tick: 0, pitch: 60, duration: 480, lyric: 'N1', vel: 100, gen:0 }],
  ['note2', { id: 'note2', tick: 240, pitch: 62, duration: 240, lyric: 'N2', vel: 100, gen:0 }],
]);

let currentMockNotesState: Map<string, NoteType>; // Will be reset in beforeEach

const mockDeleteNote = vi.fn((noteId: string) => {
  // Create a new Map instance when a note is deleted
  const newNotes = new Map(currentMockNotesState);
  newNotes.delete(noteId);
  currentMockNotesState = newNotes; // Update to the new Map instance
});
const mockUpdateNote = vi.fn();
const mockAddNote = vi.fn();
const mockGetNoteById = vi.fn((id: string) => currentMockNotesState.get(id));

const mockUseMusicDataContext: () => MusicDataContextType = () => ({
  notes: currentMockNotesState,
  deleteNote: mockDeleteNote,
  updateNote: mockUpdateNote,
  addNote: mockAddNote,
  getNoteById: mockGetNoteById,
  events: new Map(),
  addEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
  getEventById: vi.fn(),
});

vi.mock('../contexts/MusicDataContext', () => ({
  ...vi.importActual('../contexts/MusicDataContext'),
  useMusicData: vi.fn(),
}));

global.HTMLCanvasElement.prototype.getContext = vi.fn(() => {
  let currentFillStyle = '';
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(), // Added as it's used in PianoRoll
    get fillStyle() {
      return currentFillStyle;
    },
    set fillStyle(style: string) {
      currentFillStyle = style;
    },
    // Mock other properties or methods if they are accessed or called
    lineWidth: 0, // Default value
    strokeStyle: '', // Default value
  };
}) as any;

describe('PianoRoll', () => {
  beforeEach(() => {
    currentMockNotesState = new Map(JSON.parse(JSON.stringify(Array.from(initialMockNotes))));

    // Setup mock implementations for getPropertyValue
    mockGetPropertyValue.mockImplementation((variableName: string) => {
      switch (variableName) {
        case '--proll-white-key-lane-bg': return MOCK_PROLL_WHITE_KEY_LANE_BG;
        case '--proll-black-key-lane-bg': return MOCK_PROLL_BLACK_KEY_LANE_BG;
        case '--proll-pitch-line-color': return MOCK_PROLL_PITCH_LINE_COLOR;
        case '--proll-octave-line-color': return MOCK_PROLL_OCTAVE_LINE_COLOR;
        case '--proll-beat-line-color': return MOCK_PROLL_BEAT_LINE_COLOR;
        case '--proll-measure-line-color': return MOCK_PROLL_MEASURE_LINE_COLOR;
        default: return ''; // Default for unhandled properties
      }
    });
    mockGetComputedStyle.mockClear(); // Clear calls to getComputedStyle itself
    mockGetPropertyValue.mockClear(); // Clear calls to getPropertyValue

    mockDeleteNote.mockClear();
    mockUpdateNote.mockClear();
    mockAddNote.mockClear();
    mockGetNoteById.mockClear();
    MockedNoteComponent.mockClear(); // Clear the imported mock

    (useMusicData as ReturnType<typeof vi.fn>).mockImplementation(mockUseMusicDataContext);
  });

  test('renders canvas element', () => {
    render(<PianoRoll />);
    expect(screen.getByRole('graphics-canvas')).toBeInTheDocument();
  });

  test('renders NoteDisplay components for each note from useMusicData', () => {
    render(<PianoRoll />);
    expect(MockedNoteComponent).toHaveBeenCalledTimes(currentMockNotesState.size);

    currentMockNotesState.forEach(note => {
      expect(screen.getByTestId(`note-${note.id}`)).toBeInTheDocument();
      expect(screen.getByText(note.lyric!)).toBeInTheDocument();
    });
  });

  test('clicking a NoteDisplay component selects it', () => {
    render(<PianoRoll />);
    const note1MockElement = screen.getByTestId('note-note1');
    fireEvent.click(note1MockElement);

    const calls = MockedNoteComponent.mock.calls;
    const lastNote1CallProps = calls.slice().reverse().find(call => call[0].note.id === 'note1')[0];
    const lastNote2CallProps = calls.slice().reverse().find(call => call[0].note.id === 'note2')[0];

    expect(lastNote1CallProps.isSelected).toBe(true);
    expect(lastNote2CallProps.isSelected).toBe(false);
  });

  test('clicking the canvas background deselects any selected note', () => {
    render(<PianoRoll />);
    const note1MockElement = screen.getByTestId('note-note1');
    fireEvent.click(note1MockElement);

    let calls = MockedNoteComponent.mock.calls;
    let lastNote1CallProps = calls.slice().reverse().find(call => call[0].note.id === 'note1')[0];
    expect(lastNote1CallProps.isSelected).toBe(true);

    const canvasElement = screen.getByRole('graphics-canvas');
    fireEvent.click(canvasElement);

    calls = MockedNoteComponent.mock.calls;
    lastNote1CallProps = calls.slice().reverse().find(call => call[0].note.id === 'note1')[0];
    const lastNote2CallProps = calls.slice().reverse().find(call => call[0].note.id === 'note2')[0];

    expect(lastNote1CallProps.isSelected).toBe(false);
    expect(lastNote2CallProps.isSelected).toBe(false);
  });

  test('deleting a selected note via NoteDisplay calls deleteNote and clears selection', async () => {
    render(<PianoRoll />);
    const note1MockElement = screen.getByTestId('note-note1');
    fireEvent.click(note1MockElement);

    let calls = MockedNoteComponent.mock.calls;
    let lastNote1CallProps = calls.slice().reverse().find(call => call[0].note.id === 'note1')[0];
    expect(lastNote1CallProps.isSelected).toBe(true);

    const noteToFocus = screen.getByTestId('note-note1');
    noteToFocus.focus();
    await userEvent.keyboard('{Delete}');

    expect(mockDeleteNote).toHaveBeenCalledWith('note1');

    // After deletion and re-render, the note element for note1 should not exist
    expect(screen.queryByTestId('note-note1')).not.toBeInTheDocument();

    // Note2 should still be present and not selected
    const note2Element = screen.queryByTestId('note-note2');
    expect(note2Element).toBeInTheDocument();

    calls = MockedNoteComponent.mock.calls; // Re-assign to existing 'calls' variable
    // Find the latest call for note2 to check its isSelected status
    // It's possible note2 was rendered multiple times (before and after deletion of note1)
    // We care about its state in the most recent render where it appears.
    const lastNote2Call = calls.slice().reverse().find(call => call[0].note.id === 'note2');
    expect(lastNote2Call).toBeDefined(); // Ensure note2 was rendered
    if (lastNote2Call) {
      expect(lastNote2Call[0].isSelected).toBe(false);
    }
  });
});
