// src/App.tsx
import { MusicDataProvider } from './contexts/MusicDataContext';
import { PianoRoll } from './components/PianoRoll';
import { PianoKeyboard } from './components/PianoKeyboard';
import { ControlArea } from './components/ControlArea';
// import './App.css'; // Or your main CSS file

function App() {
  return (
    <MusicDataProvider>
      <div className="app-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Music Editor Prototype</h1>
        <div className="main-content" style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <div className="keyboard-area" style={{ marginRight: '10px', overflowY: 'auto', flexShrink: 0 }}>
            <PianoKeyboard />
          </div>
          <div className="pianoroll-area" style={{ flexGrow: 1, overflow: 'auto' }}>
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
