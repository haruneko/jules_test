// src/components/ControlArea.tsx
import React from 'react';
import { useMusicData } from '../contexts/MusicDataContext';
import { TempoEvent, TimeSignatureEvent } from '../types/music';

export const ControlArea: React.FC = () => {
  const { events, deleteEvent, addEvent } = useMusicData();

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

  return (
    <div style={{ border: '1px solid blue', padding: '10px', marginTop: '10px', minHeight: '150px' }}>
      <h2>Control Area</h2>
      <button onClick={handleAddSampleTempoEvent}>Add Sample Tempo Event</button>
      <button onClick={handleAddSampleTimeSignatureEvent}>Add Sample Time Signature Event</button>
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
