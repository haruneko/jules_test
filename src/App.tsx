// src/App.tsx
import { MusicDataProvider } from './contexts/MusicDataContext';
import { PianoRoll } from './components/PianoRoll';
import { ControlArea } from './components/ControlArea';
// If there's a default App.css or index.css, ensure it's imported or styles are handled.
// import './App.css'; // Or your main CSS file

function App() {
  return (
    <MusicDataProvider>
      <div className="container" style={{ padding: '20px' }}>
        <h1>Music Editor Prototype</h1>
        <PianoRoll />
        <ControlArea />
        {/*
          More complex forms for adding notes/events can be added here or within the components themselves.
          For now, sample add buttons are within PianoRoll and ControlArea.
        */}
      </div>
    </MusicDataProvider>
  );
}

export default App;
