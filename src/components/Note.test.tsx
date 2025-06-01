// src/components/Note.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { NoteComponent } from './Note'; // Actual component name
import { Note as NoteType } from '../types/music';

const mockNote: NoteType = {
  id: 'note1',
  tick: 0,
  pitch: 60, // C4
  duration: 480, // Quarter note
  lyric: 'Hello',
  vel: 100,
  gen: 0,
};

const mockOnSelect = vi.fn();
const mockOnDelete = vi.fn();
const mockOnUpdateLyric = vi.fn();

const defaultProps = {
  note: mockNote,
  x: 10,
  y: 50,
  width: 100,
  height: 20,
  isSelected: false,
  onSelect: mockOnSelect,
  onDelete: mockOnDelete,
  onUpdateLyric: mockOnUpdateLyric,
};

describe('NoteComponent', () => {
  beforeEach(() => {
    // Clear mock call counts before each test
    mockOnSelect.mockClear();
    mockOnDelete.mockClear();
    mockOnUpdateLyric.mockClear();
  });

  test('renders with lyric', () => {
    render(<NoteComponent {...defaultProps} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('renders with pitch if no lyric', () => {
    render(<NoteComponent {...defaultProps} note={{ ...mockNote, lyric: '' }} />);
    expect(screen.getByText(`P:${mockNote.pitch}`)).toBeInTheDocument();
  });

  test('calls onSelect when clicked', () => {
    render(<NoteComponent {...defaultProps} />);
    const noteElement = screen.getByText('Hello');
    fireEvent.click(noteElement);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockNote.id);
  });

  test('shows selection style when isSelected is true', () => {
    render(<NoteComponent {...defaultProps} isSelected={true} />);
    const noteElement = screen.getByText('Hello').parentElement; // Get the div
    expect(noteElement).toHaveStyle('background-color: lightblue');
    expect(noteElement).toHaveStyle('border: 2px solid dodgerblue');
  });

  test('shows default style when isSelected is false', () => {
    render(<NoteComponent {...defaultProps} isSelected={false} />);
    const noteElement = screen.getByText('Hello').parentElement; // Get the div
    expect(noteElement).toHaveStyle('background-color: cornflowerblue');
    expect(noteElement).toHaveStyle('border: 1px solid black');
  });

  describe('Interactions for a selected note', () => {
    test('calls onDelete when Delete key is pressed', async () => {
      render(<NoteComponent {...defaultProps} isSelected={true} />);
      const noteElement = screen.getByText('Hello').parentElement!;
      noteElement.focus(); // Element must be focused to receive key events
      await userEvent.keyboard('{Delete}');
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockNote.id);
    });

    test('calls onDelete when Backspace key is pressed', async () => {
      render(<NoteComponent {...defaultProps} isSelected={true} />);
      const noteElement = screen.getByText('Hello').parentElement!;
      noteElement.focus();
      await userEvent.keyboard('{Backspace}');
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockNote.id);
    });

    test('enters lyric edit mode on Enter key press', async () => {
      render(<NoteComponent {...defaultProps} isSelected={true} />);
      const noteElement = screen.getByText('Hello').parentElement!;
      noteElement.focus();
      await userEvent.keyboard('{Enter}');

      const inputField = screen.getByRole('textbox');
      expect(inputField).toBeInTheDocument();
      expect(inputField).toHaveValue(mockNote.lyric);
    });

    test('updates lyric on Enter in edit mode', async () => {
      render(<NoteComponent {...defaultProps} isSelected={true} />);
      const noteElement = screen.getByText('Hello').parentElement!;
      noteElement.focus();
      await userEvent.keyboard('{Enter}'); // Enter edit mode

      const inputField = screen.getByRole('textbox');
      await userEvent.clear(inputField);
      await userEvent.type(inputField, 'New Lyric');
      await userEvent.keyboard('{Enter}'); // Confirm edit

      expect(mockOnUpdateLyric).toHaveBeenCalledTimes(1);
      expect(mockOnUpdateLyric).toHaveBeenCalledWith(mockNote.id, 'New Lyric');
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); // Input field should disappear
      // The component itself updates its internal state for currentLyric,
      // but the display will show note.lyric until the prop is updated by the parent.
      // So, we check if the input is gone, and the callback was called.
    });

    test('cancels lyric edit on Escape key', async () => {
      render(<NoteComponent {...defaultProps} isSelected={true} />);
      const noteElement = screen.getByText('Hello').parentElement!;
      noteElement.focus();
      await userEvent.keyboard('{Enter}'); // Enter edit mode

      const inputField = screen.getByRole('textbox');
      await userEvent.clear(inputField);
      await userEvent.type(inputField, 'Changed Lyric');
      await userEvent.keyboard('{Escape}'); // Cancel edit

      expect(mockOnUpdateLyric).not.toHaveBeenCalled();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); // Input field should disappear
      expect(screen.getByText('Hello')).toBeInTheDocument(); // Original lyric should remain or be restored
    });

    test('updates lyric on blur from input field', async () => {
        render(<NoteComponent {...defaultProps} isSelected={true} />);
        const noteElement = screen.getByText('Hello').parentElement!;
        noteElement.focus();
        await userEvent.keyboard('{Enter}'); // Enter edit mode

        const inputField = screen.getByRole('textbox') as HTMLInputElement;
        await userEvent.clear(inputField);
        await userEvent.type(inputField, 'Updated on Blur');

        // userEvent.tab() simulates the user pressing Tab, which should trigger blur.
        // userEvent handles act() wrapper internally for its events.
        await userEvent.tab();

        // Check that onUpdateLyric was called (due to blur handler in NoteComponent)
        expect(mockOnUpdateLyric).toHaveBeenCalledTimes(1);
        expect(mockOnUpdateLyric).toHaveBeenCalledWith(mockNote.id, 'Updated on Blur');

        // Check that the input field is no longer present
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
  });
});
