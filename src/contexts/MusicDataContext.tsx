// src/contexts/MusicDataContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, TimeSignatureEvent, TempoEvent } from '../types/music';

// Helper to check if an object is a TempoEvent based on its properties
function isTempoEventData(eventData: any): eventData is Omit<TempoEvent, 'id'> {
  return typeof eventData.bpm === 'number';
}

// Helper to check if an object is a TimeSignatureEvent based on its properties
function isTimeSignatureEventData(eventData: any): eventData is Omit<TimeSignatureEvent, 'id'> {
  return typeof eventData.numerator === 'number' && typeof eventData.denominator === 'number';
}


// Define the shape of the context data
interface MusicDataContextType {
  notes: Map<string, Note>;
  addNote: (newNoteData: Omit<Note, 'id'>) => Note;
  updateNote: (noteId: string, updates: Partial<Omit<Note, 'id'>>) => void;
  deleteNote: (noteId: string) => void;
  getNoteById: (noteId: string) => Note | undefined;

  events: Map<string, TimeSignatureEvent | TempoEvent>;
  addEvent: (eventData: Omit<TimeSignatureEvent, 'id'> | Omit<TempoEvent, 'id'>) => TimeSignatureEvent | TempoEvent;
  updateEvent: (eventId: string, updates: Partial<Omit<TimeSignatureEvent, 'id'>> | Partial<Omit<TempoEvent, 'id'>>) => void;
  deleteEvent: (eventId: string) => void;
  getEventById: (eventId: string) => TimeSignatureEvent | TempoEvent | undefined;
}

// Create the context with a default undefined value
const MusicDataContext = createContext<MusicDataContextType | undefined>(undefined);

// Define the props for the provider
interface MusicDataProviderProps {
  children: ReactNode;
}

// Create the provider component
export const MusicDataProvider: React.FC<MusicDataProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Map<string, Note>>(new Map());
  const [events, setEvents] = useState<Map<string, TimeSignatureEvent | TempoEvent>>(new Map());

  // --- Note Functions ---
  const addNote = useCallback((newNoteData: Omit<Note, 'id'>): Note => {
    const id = uuidv4();
    const noteToAdd: Note = { ...newNoteData, id };
    setNotes(prevNotes => {
      const newNotes = new Map(prevNotes);
      newNotes.set(id, noteToAdd);
      return newNotes;
    });
    return noteToAdd;
  }, []);

  const updateNote = useCallback((noteId: string, updates: Partial<Omit<Note, 'id'>>) => {
    setNotes(prevNotes => {
      const newNotes = new Map(prevNotes);
      const currentNote = newNotes.get(noteId);
      if (currentNote) {
        newNotes.set(noteId, { ...currentNote, ...updates });
      }
      return newNotes;
    });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prevNotes => {
      const newNotes = new Map(prevNotes);
      newNotes.delete(noteId);
      return newNotes;
    });
  }, []);

  const getNoteById = useCallback((noteId: string): Note | undefined => {
    return notes.get(noteId);
  }, [notes]);

  // --- Event Functions ---
  const addEvent = useCallback((eventData: Omit<TimeSignatureEvent, 'id'> | Omit<TempoEvent, 'id'>): TimeSignatureEvent | TempoEvent => {
    const id = uuidv4();
    let eventToAdd: TimeSignatureEvent | TempoEvent;

    if (isTempoEventData(eventData)) {
      eventToAdd = { ...eventData, id, tick: eventData.tick, bpm: eventData.bpm } as TempoEvent;
    } else if (isTimeSignatureEventData(eventData)) {
      eventToAdd = { ...eventData, id, tick: eventData.tick, numerator: eventData.numerator, denominator: eventData.denominator } as TimeSignatureEvent;
    } else {
      // Should not happen with proper typing, but as a fallback:
      console.error("Unknown event type:", eventData);
      throw new Error("Unknown event type provided to addEvent");
    }

    setEvents(prevEvents => {
      const newEvents = new Map(prevEvents);
      newEvents.set(id, eventToAdd);
      // Optional: Sort events by tick after adding, if necessary for display or processing
      // const sortedEvents = new Map([...newEvents.entries()].sort(([, a], [, b]) => a.tick - b.tick));
      // return sortedEvents;
      return newEvents;
    });
    return eventToAdd;
  }, []);

  const updateEvent = useCallback((eventId: string, updates: Partial<Omit<TimeSignatureEvent, 'id'>> | Partial<Omit<TempoEvent, 'id'>>) => {
    setEvents(prevEvents => {
      const newEvents = new Map(prevEvents);
      const currentEvent = newEvents.get(eventId);
      if (currentEvent) {
        // Make sure to merge correctly based on event type if updates are type-specific
        // For simplicity, this example assumes updates are compatible or overwrite
        const updatedEvent = { ...currentEvent, ...updates };
        newEvents.set(eventId, updatedEvent as TimeSignatureEvent | TempoEvent); // Type assertion
      }
      return newEvents;
    });
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prevEvents => {
      const newEvents = new Map(prevEvents);
      newEvents.delete(eventId);
      return newEvents;
    });
  }, []);

  const getEventById = useCallback((eventId: string): TimeSignatureEvent | TempoEvent | undefined => {
    return events.get(eventId);
  }, [events]);

  return (
    <MusicDataContext.Provider value={{
      notes,
      addNote,
      updateNote,
      deleteNote,
      getNoteById,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
    }}>
      {children}
    </MusicDataContext.Provider>
  );
};

export const useMusicData = (): MusicDataContextType => {
  const context = useContext(MusicDataContext);
  if (context === undefined) {
    throw new Error('useMusicData must be used within a MusicDataProvider');
  }
  return context;
};
