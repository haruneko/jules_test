mod menu;

#[derive(Clone, serde::Serialize)]
struct DebugActionPayload {
  action: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle();
            let menu = menu::create_app_menu(app_handle);
            app_handle.set_menu(menu)?;
            Ok(())
        })
        .on_menu_event(|app, event| { // Add menu event handler
            let event_id = event.id().as_ref();
            match event_id {
                "add_sample_tempo_event" | "add_sample_time_signature_event" | "add_doremiredo_notes" => {
                    app.emit("debug_action", DebugActionPayload { action: event_id.to_string() })
                        .expect("Failed to emit debug_action event");
                    println!("Emitted debug_action: {}", event_id); // For logging
                }
                // Handle other menu items if needed, or log them
                "new_file" | "open_file" | "import_file" | "save_file" | "save_as_file" | "undo" | "redo" | "cut" | "copy" | "paste" => {
                     // For now, just print a message for non-debug items
                     println!("Menu item clicked: {}", event_id);
                }
                _ => {
                    println!("Unknown menu item clicked: {}", event_id);
                }
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
