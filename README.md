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

The application now features a more integrated and visually detailed interactive music editing interface:

*   **Vertical Piano Keyboard**: The `src/components/PianoKeyboard.tsx` component displays a vertical piano keyboard (MIDI 0-127, highest note at the top).
    *   Keys are labeled (e.g., C4, F#5), and C4 is highlighted.
    *   Each key's height is synchronized with `PianoRoll` note lanes for direct pitch alignment.
    *   White keys feature a bottom border for better visual separation.
    *   Black keys now have the same depth (interaction width) as white keys, while remaining visually distinct.
*   **Enhanced Piano Roll**: The `src/components/PianoRoll.tsx` uses a canvas to render its grid.
    *   This grid features a subtle background color for lanes corresponding to black piano keys, improving visual distinction.
    *   It displays notes sourced from `MusicDataContext`.
*   **Note Display & Interaction**: Individual musical notes (`src/components/Note.tsx`) are rendered on the piano roll and support selection, deletion, and lyric editing.
*   **Integrated Layout & Scrolling**:
    *   The Piano Keyboard and Piano Roll are displayed in a gapless, side-by-side layout (`src/App.tsx`), aligned at their top edges.
    *   Vertical scrolling of the Piano Keyboard and Piano Roll areas is synchronized, ensuring a consistent view when navigating through pitches.
*   **Control Area**: A section (`src/components/ControlArea.tsx`) remains for managing musical events like tempo and time signature changes.

## Menu Structure

The application implements a native menu structure, primarily for debugging and future feature placeholders. The menu is handled via backend events in Rust (`src-tauri/src/lib.rs`) and frontend listeners (`src/App.tsx`).

*   **File**:
    *   New (event: `file-new`) - Placeholder
    *   Open (event: `file-open`) - Placeholder
    *   Import (event: `file-import`) - Placeholder
    *   Save (event: `file-save`) - Placeholder
    *   Save As... (event: `file-save-as`) - Placeholder
*   **Edit**:
    *   Undo (event: `edit-undo`) - Placeholder
    *   Redo (event: `edit-redo`) - Placeholder
    *   Cut (event: `edit-cut`) - Placeholder
    *   Copy (event: `edit-copy`) - Placeholder
    *   Paste (event: `edit-paste`) - Placeholder
*   **Debug**:
    *   Add Sample Tempo Event (event: `debug-add-sample-tempo-event`) - Functional: Adds a sample tempo event to the track.
    *   Add Sample Time Signature Event (event: `debug-add-sample-time-signature-event`) - Functional: Adds a sample time signature event to the track.
    *   Add 'DoReMiReDo' Notes (event: `debug-add-do-re-mi-re-do-notes`) - Functional: Adds a sequence of five notes (C4-D4-E4-D4-C4) to the piano roll.

Note: The declarative definition of this menu in `tauri.conf.json` has been removed due to schema compatibility issues with the current Tauri CLI version. The menu will still appear and function if the OS can render it based on the application's capabilities and event handlers.

## Key Components

*   **`src/App.tsx`**: The main application component. It sets up the overall layout, including the tightly integrated side-by-side Piano Keyboard and Piano Roll, and implements their scroll synchronization. It also provides necessary data contexts.
*   **`src/components/PianoRoll.tsx`**: Renders an HTML5 Canvas-based grid representing pitch and time. Note lanes for black keys have a distinct background color. It displays `NoteComponent` instances based on data from `MusicDataContext` and manages note selection. Its internal padding and title have been removed for a cleaner integration.
*   **`src/components/PianoKeyboard.tsx`**: Displays a vertical visual piano keyboard covering all 128 MIDI notes. Key heights are synchronized with `PianoRoll` note lanes. White keys have bottom borders, and black keys share the same depth as white keys. It includes note labels and a highlighted C4. Its internal padding and title have been removed.
*   **`src/components/Note.tsx`**: Represents an individual musical note as an absolutely positioned HTML element over the Piano Roll. It handles its own display (lyric, selection state) and user interactions (selection, deletion, lyric editing via callbacks).
*   **`src/components/ControlArea.tsx`**: A component for displaying and interacting with control events like tempo and time signature changes.

## Theming and Customization

The application's color scheme can be customized using CSS custom properties (variables). These properties are defined in `src/App.css` within the `:root` selector for the default (light) theme, and also within a `@media (prefers-color-scheme: dark)` block providing initial support for a dark theme.

You can customize these colors by:
*   Modifying their values directly in `src/App.css`.
*   Overriding them in another CSS file that is imported after `App.css`.
*   Dynamically changing them using browser developer tools for live experimentation.

### Available CSS Custom Properties:

**Piano Keyboard (`--pkb-`)**
*   `--pkb-white-key-bg`: Background color for white keys (Default: `#FFFFFF`)
*   `--pkb-white-key-text`: Text color for white keys (Default: `#212529`)
*   `--pkb-black-key-bg`: Background color for black keys (Default: `#343a40`)
*   `--pkb-black-key-text`: Text color for black keys (Default: `#f8f9fa`)
*   `--pkb-key-border-color`: General border color for keys (Default: `#333333`)
*   `--pkb-white-key-bottom-border-color`: Specific bottom border color for white keys (Default: `#cccccc`)
*   `--pkb-c4-key-bg`: Background color for the C4 key (Default: `#FFD700`)
*   `--pkb-c4-key-text`: Text color for the C4 key (Default: `#000000`)

**Piano Roll (`--proll-`)**
*   `--proll-white-key-lane-bg`: Background color for white key lanes (Default: `#FFFFFF`)
*   `--proll-black-key-lane-bg`: Background color for black key lanes (Default: `#f0f0f0`)
*   `--proll-pitch-line-color`: Color for normal pitch grid lines (Default: `#e0e0e0`)
*   `--proll-octave-line-color`: Color for octave grid lines (C notes) (Default: `#b0b0b0`)
*   `--proll-beat-line-color`: Color for beat subdivision lines (Default: `#dcdcdc`)
*   `--proll-measure-line-color`: Color for measure lines (Default: `#aaaaaa`)

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

## Known Issues / Build Limitations

This project currently faces build issues due to conflicts between the required Rust Minimum Supported Version (MSRV) for some dependencies (e.g., `zerovec`, `tauri`, `icu_provider`, `zvariant`, `tinystr`, `yoke`) and the Rust version (1.75.0) available in the testing environment. The provided build and run commands (`pnpm tauri dev`, `pnpm tauri build`) may require a newer Rust toolchain (e.g., Rust 1.81+ or newer for some dependencies) and potentially adjustments to dependency versions in `src-tauri/Cargo.toml` to resolve these conflicts. The `src-tauri/tauri.conf.json` has also been simplified to pass schema validation with the current CLI, which involved removing the declarative `allowlist` and `menu` configurations.

## Development

Standard commands (see Known Issues above):
To start the development server and open the app in development mode, run the following command in the project root directory:

```bash
pnpm tauri dev
```

This command will compile the Rust backend and start the Vite development server for the React frontend. Changes in your frontend or backend code will trigger automatic rebuilding and reloading of the application.

## Building

Standard commands (see Known Issues above):
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

Standard commands (see Known Issues above):
Manual interaction with the UI is still valuable for end-to-end testing:

1.  Run `pnpm tauri dev`.
2.  Use the **Debug Menu** to add sample data:
    *   `Debug > Add Sample Tempo Event`
    *   `Debug > Add Sample Time Signature Event`
    *   `Debug > Add 'DoReMiReDo' Notes`
    These actions will populate the piano roll and event list for testing.
3.  **Interact with Notes**:
    *   Click on notes in the Piano Roll to select/deselect them.
    *   With a note selected, press 'Delete' or 'Backspace' to remove it.
    *   With a note selected, press 'Enter' to edit its lyric. Type a new lyric and press 'Enter' to confirm or 'Escape' to cancel.
4.  Verify that the Piano Keyboard correctly displays note positions and highlights C4.
5.  Verify that events (Tempo, Time Signature) are displayed and can be manipulated in the "Control Area".
