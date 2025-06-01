# Music Editor Prototype (Tauri + React + Typescript)

This project is a prototype for a music editor frontend, focusing on handling data structures for vocal synthesis software like VOCALOID, UTAU, and Synthesizer V. It's built using Tauri, React, and Typescript with Vite.

## Project Overview

The application aims to provide a user interface for creating and editing musical scores, with a layout typically featuring a piano roll at the top and a control area at the bottom. This prototype focuses on establishing the foundational data structures and basic UI placeholders.

## Data Structures

Core data types are defined in `src/types/music.ts`:

*   **`Note`**: Represents a musical note with properties like `id`, `tick` (timing), `pitch`, `duration`, `lyric`, `vel` (velocity), and `gen` (a generic parameter).
*   **`TempoEvent`**: Represents a tempo change event with `id`, `tick`, and `bpm`.
*   **`TimeSignatureEvent`**: Represents a time signature change event with `id`, `tick`, `numerator`, and `denominator`.
*   **`ControlCurve`**: (Defined but not yet fully implemented in UI/State) Represents control curves with `id`, `name`, and `points` (a map of tick to value).

## State Management

Application state, primarily lists of notes and events, is managed using React Context API.
*   **`src/contexts/MusicDataContext.tsx`**: Provides `MusicDataProvider` and the `useMusicData` hook.
*   Notes and events are stored in `Map` objects, keyed by their unique IDs.
*   Context provides functions for CRUD operations (Create, Read, Update, Delete) on notes and events (e.g., `addNote`, `deleteEvent`).

## UI Features

The application now features a basic interactive music editing interface:

*   **Piano Keyboard**: A visual representation of a piano keyboard (`src/components/PianoKeyboard.tsx`) displaying the full MIDI note range (0-127). Keys are labeled with note names (e.g., C4, F#5), and C4 is highlighted as a reference.
*   **Piano Roll**: A canvas-based piano roll (`src/components/PianoRoll.tsx`) that visually represents musical notes against a grid of pitches and time. It displays notes sourced from the `MusicDataContext`.
*   **Note Display**: Individual musical notes (`src/components/Note.tsx`) are rendered on the piano roll. These notes are interactive:
    *   **Selection**: Clicking a note selects it, visually highlighting it.
    *   **Deletion**: Pressing 'Delete' or 'Backspace' when a note is selected removes it.
    *   **Lyric Editing**: Pressing 'Enter' on a selected note allows editing its lyric directly on the note.
*   **Control Area**: A section (`src/components/ControlArea.tsx`) for managing musical events like tempo and time signature changes.

## Key Components

*   **`src/App.tsx`**: The main application component that sets up the overall layout (including the side-by-side Piano Keyboard and Piano Roll) and providers.
*   **`src/components/PianoRoll.tsx`**: Renders a canvas-based grid for pitch and time. It displays `NoteComponent` instances based on data from `MusicDataContext` and manages note selection.
*   **`src/components/PianoKeyboard.tsx`**: Displays a visual piano keyboard with all 128 MIDI notes, labels, and a highlighted C4. It's positioned to the left of the Piano Roll.
*   **`src/components/Note.tsx`**: Represents an individual musical note as an absolutely positioned HTML element over the Piano Roll. It handles its own display (lyric, selection state) and user interactions (selection, deletion, lyric editing via callbacks).
*   **`src/components/ControlArea.tsx`**: A component for displaying and interacting with control events like tempo and time signature changes.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Project Setup

1.  **Prerequisites**:
    *   Node.js (which includes npm or pnpm/yarn)
    *   Rust and its toolchain (including Cargo)
    *   Follow the Tauri prerequisites guide: [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)
2.  **Clone the repository** (if applicable)
3.  **Install dependencies**:
    Navigate to the project root directory and run:
    ```bash
    pnpm install
    ```
    (If you prefer npm or yarn, you might need to adapt this command and ensure `uuid` and `@types/uuid` are installed.)

## Development

To start the development server and open the app in development mode, run the following command in the project root directory:

```bash
pnpm tauri dev
```

This command will compile the Rust backend and start the Vite development server for the React frontend. Changes in your frontend or backend code will trigger automatic rebuilding and reloading of the application.

## Building

To build the application for production, use the following command:

```bash
pnpm tauri build
```

This will compile the Rust backend in release mode and build the frontend assets. The resulting executables and installers will be located in `src-tauri/target/release/bundle/`. (The exact path might vary based on your project's name if it's different from the template's default).

**Important Note on Rust Version:** Some Tauri dependencies require Rust compiler version `1.77.2` or newer. If your installed Rust version is older (e.g., `1.75.0`), the `pnpm tauri build` command may fail during backend compilation. Please ensure your Rust installation is up to date if you encounter build issues. You can check your Rust version with `rustc --version` and update it using `rustup update`.

## Testing

Unit tests for key React components have been implemented using [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Jest](https://jestjs.io/) (via Vitest's Jest-compatible API if using Vitest, or directly if Jest is configured).

*   **Test Files**: Located alongside the components they test (e.g., `src/components/PianoRoll.test.tsx`).
*   **Covered Components**: `PianoKeyboard`, `PianoRoll`, and `NoteComponent` (from `Note.tsx`) have unit tests covering rendering, basic interactions, and callback invocations.
*   **Mocks**: `useMusicData` context and child components (like `NoteComponent` within `PianoRoll` tests) are mocked where appropriate to isolate component logic.

**Running Tests:**

To run the unit tests, use the following command in the project root directory:

```bash
pnpm test
```
This command will execute the test suite and report results. (Ensure Vitest or your chosen test runner is configured in `package.json`'s `scripts` section for this command).

**Manual Testing:**

Manual interaction with the UI is still valuable for end-to-end testing:

1.  Run `pnpm tauri dev`.
2.  Use the "Add Sample Note/Event" buttons in the "Control Area" to populate data if needed (or implement other ways to add notes).
3.  **Interact with Notes**:
    *   Click on notes in the Piano Roll to select/deselect them.
    *   With a note selected, press 'Delete' or 'Backspace' to remove it.
    *   With a note selected, press 'Enter' to edit its lyric. Type a new lyric and press 'Enter' to confirm or 'Escape' to cancel.
4.  Verify that the Piano Keyboard correctly displays note positions and highlights C4.
5.  Verify that events (Tempo, Time Signature) are displayed and can be manipulated in the "Control Area".
