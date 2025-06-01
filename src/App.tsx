// src/App.tsx
import { useRef, useEffect } from 'react'; // Removed unused React default import
import { MusicDataProvider } from './contexts/MusicDataContext';
import { PianoRoll } from './components/PianoRoll';
import { PianoKeyboard } from './components/PianoKeyboard';
import { ControlArea } from './components/ControlArea';
// import './App.css'; // Or your main CSS file

function App() {
  const keyboardScrollRef = useRef<HTMLDivElement>(null);
  const pianoRollScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);
  // Using a slightly more robust RAF-based approach for resetting the sync flag
  const syncRafRef = useRef<number | null>(null);


  useEffect(() => {
    const keyboardEl = keyboardScrollRef.current;
    const pianoRollEl = pianoRollScrollRef.current;

    if (!keyboardEl || !pianoRollEl) return;

    const handleKeyboardScroll = () => {
      if (syncRafRef.current) cancelAnimationFrame(syncRafRef.current);
      if (isSyncingScroll.current) {
        isSyncingScroll.current = false; // Reset if we are the source of the immediate previous sync
        return;
      }
      isSyncingScroll.current = true;
      pianoRollEl.scrollTop = keyboardEl.scrollTop;
      // Reset flag after the next animation frame to allow the other scroll event to process and be ignored
      syncRafRef.current = requestAnimationFrame(() => {
        isSyncingScroll.current = false;
      });
    };

    const handlePianoRollScroll = () => {
      if (syncRafRef.current) cancelAnimationFrame(syncRafRef.current);
      if (isSyncingScroll.current) {
        isSyncingScroll.current = false;
        return;
      }
      isSyncingScroll.current = true;
      keyboardEl.scrollTop = pianoRollEl.scrollTop;
      syncRafRef.current = requestAnimationFrame(() => {
        isSyncingScroll.current = false;
      });
    };

    keyboardEl.addEventListener('scroll', handleKeyboardScroll);
    pianoRollEl.addEventListener('scroll', handlePianoRollScroll);

    return () => {
      keyboardEl.removeEventListener('scroll', handleKeyboardScroll);
      pianoRollEl.removeEventListener('scroll', handlePianoRollScroll);
      if (syncRafRef.current) {
        cancelAnimationFrame(syncRafRef.current);
      }
    };
  }, []); // Empty dependency array: run once on mount

  return (
    <MusicDataProvider>
      <div className="app-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)' /* Adjust for padding */ }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', flexShrink: 0 }}>Music Editor Prototype</h1>
        <div className="main-content" style={{ display: 'flex', flexGrow: 1, overflow: 'hidden', alignItems: 'flex-start' /* Align items to the top */ }}>
          <div ref={keyboardScrollRef} className="keyboard-area" style={{ overflowY: 'auto', flexShrink: 0, height: '100%' /* Allow keyboard to scroll if taller than main-content */ }}>
            <PianoKeyboard />
          </div>
          <div ref={pianoRollScrollRef} className="pianoroll-area" style={{ flexGrow: 1, overflow: 'auto', height: '100%' /* Allow piano roll to scroll if taller */ }}>
            <PianoRoll />
          </div>
        </div>
        <div className="control-area-container" style={{ marginTop: '20px', flexShrink: 0 }}>
          <ControlArea />
        </div>
        {/*
          More complex forms for adding notes/events can be added here or within the components themselves.
        */}
      </div>
    </MusicDataProvider>
  );
}

export default App;
