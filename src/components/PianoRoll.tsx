// src/components/PianoRoll.tsx
import React from 'react';
import { useMusicData } from '../contexts/MusicDataContext';
import { Note } from '../types/music';

export const PianoRoll: React.FC = () => {
  const { notes, deleteNote, addNote } = useMusicData();

  // Example: Function to add a sample note
  const handleAddSampleNote = () => {
    addNote({
      tick: Math.floor(Math.random() * 1920), // Random tick
      pitch: 60 + Math.floor(Math.random() * 24), // Random pitch around C4
      duration: 480, // Quarter note in ticks (assuming 480 ticks per beat)
      lyric: 'ら',
      vel: 100,
      gen: 0,
    });
  };

  return (
    <div style={{ border: '1px solid green', padding: '10px', minHeight: '200px' }}>
      <h2>Piano Roll Area</h2>
      <button onClick={handleAddSampleNote}>Add Sample Note</button>
      {notes.size === 0 && <p>No notes yet.</p>}
      {Array.from(notes.values()).sort((a,b) => a.tick - b.tick).map((note: Note) => (
        <div key={note.id} style={{ border: '1px solid lightgray', margin: '5px', padding: '5px' }}>
          <p>ID: {note.id}</p>
          <p>Tick: {note.tick}, Pitch: {note.pitch}, Duration: {note.duration}, Lyric: {note.lyric}</p>
          <p>VEL: {note.vel}, GEN: {note.gen}</p>
          <button onClick={() => deleteNote(note.id)}>Delete Note</button>
        </div>
      ))}
    </div>
  );
};
