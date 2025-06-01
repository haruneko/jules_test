// src/components/Note.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Note as NoteType } from '../types/music'; // Assuming NoteType includes id, lyric etc.

interface NoteProps {
  note: NoteType;
  x: number; // Position x on the piano roll
  y: number; // Position y on the piano roll (derived from pitch)
  width: number; // Visual width (derived from duration)
  height: number; // Visual height (e.g., NOTE_HEIGHT from PianoRoll)
  isSelected: boolean;
  onSelect: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onUpdateLyric: (noteId: string, newLyric: string) => void;
}

export const NoteComponent: React.FC<NoteProps> = ({
  note,
  x,
  y,
  width,
  height,
  isSelected,
  onSelect,
  onDelete,
  onUpdateLyric,
}) => {
  const [isEditingLyric, setIsEditingLyric] = useState(false);
  const [currentLyric, setCurrentLyric] = useState(note.lyric);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentLyric(note.lyric); // Sync if prop changes
  }, [note.lyric]);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingLyric, isSelected]);


  const handleNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent PianoRoll click handling if any
    onSelect(note.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (!isSelected) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      onDelete(note.id);
      console.log(`Delete requested for note ${note.id}`);
    } else if (e.key === 'Enter') {
      if (isEditingLyric) {
        onUpdateLyric(note.id, currentLyric);
        console.log(`Lyric update for note ${note.id}: ${currentLyric}`);
      }
      setIsEditingLyric(!isEditingLyric); // Toggle edit mode or commit
    } else if (e.key === 'Escape') {
      if (isEditingLyric) {
        setCurrentLyric(note.lyric); // Revert changes
        setIsEditingLyric(false);
        console.log(`Lyric edit cancelled for note ${note.id}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLyric(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent note's main keydown handler
    if (e.key === 'Enter') {
      onUpdateLyric(note.id, currentLyric);
      setIsEditingLyric(false);
      console.log(`Lyric update for note ${note.id} from input: ${currentLyric}`);
    } else if (e.key === 'Escape') {
      setCurrentLyric(note.lyric); // Revert
      setIsEditingLyric(false);
      console.log(`Lyric edit cancelled for note ${note.id} from input`);
    }
  };


  const noteStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: width,
    height: height,
    backgroundColor: isSelected ? 'lightblue' : 'cornflowerblue',
    border: isSelected ? '2px solid dodgerblue' : '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'white',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  return (
    <div
      style={noteStyle}
      onClick={handleNoteClick}
      onKeyDown={isEditingLyric ? undefined : handleKeyDown} // Only handle main keydown if not editing lyric in input
      tabIndex={0} // Make it focusable
      title={`Tick: ${note.tick}, Pitch: ${note.pitch}, Lyric: ${note.lyric}`}
    >
      {isEditingLyric ? (
        <input
          ref={inputRef}
          type="text"
          value={currentLyric}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={() => { // Commit on blur as well, or revert
            onUpdateLyric(note.id, currentLyric);
            setIsEditingLyric(false);
            console.log(`Lyric update for note ${note.id} on blur: ${currentLyric}`);
          }}
          style={{ width: '90%', fontSize: '10px', boxSizing: 'border-box' }}
        />
      ) : (
        <span>{note.lyric || `P:${note.pitch}`}</span>
      )}
    </div>
  );
};
