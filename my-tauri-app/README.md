# Tauri + React + Typescript - my-tauri-app

This template should help get you started developing with Tauri, React and Typescript in Vite for your application: my-tauri-app.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

To start the development server and open the app in development mode, run the following command in the root directory of the `my-tauri-app` project:

```bash
pnpm tauri dev
```

This command will compile the Rust backend and start the Vite development server for the React frontend. Changes in your frontend or backend code will trigger automatic rebuilding and reloading of the application.

## Building

To build the application for production, use the following command:

```bash
pnpm tauri build
```

This will compile the Rust backend in release mode and build the frontend assets. The resulting executables and installers will be located in `my-tauri-app/src-tauri/target/release/bundle/`.

## Testing

To run tests for the `my-tauri-app` application (assuming you have set them up in your `package.json` or related test runner configuration), use:

```bash
pnpm test
```

Ensure you have appropriate test scripts defined in your `package.json` for this command to work. For example:
```json
// package.json
{
  "scripts": {
    "test": "vitest" // Or your preferred test command
  }
}
```
