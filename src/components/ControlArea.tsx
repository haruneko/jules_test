// src/components/ControlArea.tsx
import React from 'react';
import { useMusicData } from '../contexts/MusicDataContext';
import { TempoEvent, TimeSignatureEvent } from '../types/music'; // Note type removed as addNote is not directly called here anymore

export const ControlArea: React.FC = () => {
  const { events, deleteEvent } = useMusicData(); // Removed addEvent, addNote, and the specific handlers

  // The buttons for handleAddSampleTempoEvent, handleAddSampleTimeSignatureEvent,
  // and handleAddDoReMiReDo are now removed from here.

  return (
    <div style={{ border: '1px solid blue', padding: '10px', marginTop: '10px', minHeight: '50px' /* Adjusted minHeight */ }}>
      <h2>Control Area (Event Display)</h2>
      {/* Buttons removed */}
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
