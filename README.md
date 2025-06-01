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

## Key Components

*   **`src/App.tsx`**: The main application component that sets up the overall layout and providers.
*   **`src/components/PianoRoll.tsx`**: A placeholder component for displaying and interacting with musical notes. Currently shows a list of notes and allows adding sample notes and deleting existing ones.
*   **`src/components/ControlArea.tsx`**: A placeholder component for displaying and interacting with control events like tempo and time signature changes. Currently shows a list of events and allows adding sample events and deleting existing ones.

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

Currently, testing is primarily done through manual interaction with the UI:
1.  Run `pnpm tauri dev`.
2.  Use the "Add Sample Note/Event" buttons to populate data.
3.  Verify that notes and events are displayed correctly.
4.  Use the "Delete Note/Event" buttons and verify items are removed.

Formal automated tests (e.g., using Vitest) are not yet implemented for the data manipulation logic or components but can be added. If Vitest is set up (as suggested by the original template), you could run tests using:

```bash
pnpm test
```

You would need to create test files (e.g., `*.test.ts` or `*.spec.ts`) with actual test cases. For example, to test context functions:
```typescript
// Example: src/contexts/MusicDataContext.test.ts
import { describe, it, expect } from 'vitest';
// ... import functions from context or a test wrapper

describe('MusicDataContext', () => {
  it('should add a note correctly', () => {
    // Test logic here
    // const { result } = renderHook(() => useMusicData(), { wrapper: MusicDataProvider });
    // act(() => { result.current.addNote(...); });
    // expect(result.current.notes.size).toBe(1);
  });
});
```
(The above test snippet is a conceptual example and would require further setup like `@testing-library/react-hooks` or similar for testing hooks.)
