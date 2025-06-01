// src/App.tsx
import { MusicDataProvider } from './contexts/MusicDataContext';
import { PianoRoll } from './components/PianoRoll';
import { PianoKeyboard } from './components/PianoKeyboard';
import { ControlArea } from './components/ControlArea';
// import './App.css'; // Or your main CSS file

function App() {
  return (
    <MusicDataProvider>
      <div className="app-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)' /* Adjust for padding */ }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', flexShrink: 0 }}>Music Editor Prototype</h1>
        <div className="main-content" style={{ display: 'flex', flexGrow: 1, overflow: 'hidden', alignItems: 'flex-start' /* Align items to the top */ }}>
          <div className="keyboard-area" style={{ overflowY: 'auto', flexShrink: 0, height: '100%' /* Allow keyboard to scroll if taller than main-content */ }}>
            <PianoKeyboard />
          </div>
          <div className="pianoroll-area" style={{ flexGrow: 1, overflow: 'auto', height: '100%' /* Allow piano roll to scroll if taller */ }}>
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
