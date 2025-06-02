// src/components/ControlArea.tsx
import React from 'react';
import { useMusicData } from '../contexts/MusicDataContext';
import { Note, TempoEvent, TimeSignatureEvent } from '../types/music'; // Added Note type

export const ControlArea: React.FC = () => {
  const { events, deleteEvent, addEvent, addNote } = useMusicData(); // Added addNote

  const handleAddSampleTempoEvent = () => {
    addEvent({
      tick: Math.floor(Math.random() * 1920),
      bpm: 120 + Math.floor(Math.random() * 60),
    });
  };

  const handleAddSampleTimeSignatureEvent = () => {
    addEvent({
      tick: Math.floor(Math.random() * 1920),
      numerator: Math.random() > 0.5 ? 4 : 3,
      denominator: 4,
    });
  };

  const handleAddDoReMiReDo = () => {
    const notesToAdd: Omit<Note, 'id'>[] = [
      { tick: 0, pitch: 60, duration: 480, lyric: "ド", vel: 100, gen: 0 },
      { tick: 480, pitch: 62, duration: 480, lyric: "レ", vel: 100, gen: 0 },
      { tick: 960, pitch: 64, duration: 480, lyric: "ミ", vel: 100, gen: 0 },
      { tick: 1440, pitch: 62, duration: 480, lyric: "レ", vel: 100, gen: 0 },
      { tick: 1920, pitch: 60, duration: 480, lyric: "ド", vel: 100, gen: 0 },
    ];

    notesToAdd.forEach(noteData => {
      addNote(noteData);
    });
    console.log("Added 'DoReMiReDo' notes.");
  };

  return (
    <div style={{ border: '1px solid blue', padding: '10px', marginTop: '10px', minHeight: '150px' }}>
      <h2>Control Area</h2>
      <button onClick={handleAddSampleTempoEvent}>Add Sample Tempo Event</button>
      <button onClick={handleAddSampleTimeSignatureEvent}>Add Sample Time Signature Event</button>
      <button onClick={handleAddDoReMiReDo}>Add 'DoReMiReDo' Notes</button>
      {events.size === 0 && <p>No events yet.</p>}
      {Array.from(events.values()).sort((a,b) => a.tick - b.tick).map((event: TempoEvent | TimeSignatureEvent) => (
        <div key={event.id} style={{ border: '1px solid lightgray', margin: '5px', padding: '5px' }}>
          <p>ID: {event.id}</p>
          <p>Tick: {event.tick}</p>
          {'bpm' in event ? (
            <p>Type: Tempo, BPM: {event.bpm}</p>
          ) : (
            <p>Type: Time Signature, Value: {event.numerator}/{event.denominator}</p>
          )}
          <button onClick={() => deleteEvent(event.id)}>Delete Event</button>
        </div>
      ))}
    </div>
  );
};
