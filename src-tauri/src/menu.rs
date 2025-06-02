// src-tauri/src/menu.rs
use tauri::{menu::*, AppHandle, Context, Runtime};

pub fn create_app_menu<R: Runtime>(app_handle: &AppHandle<R>) -> Menu<R> {
    let file_menu = SubmenuBuilder::new(app_handle, "File")
        .item(&MenuItemBuilder::with_id("new_file", "New").build(app_handle))
        .item(&MenuItemBuilder::with_id("open_file", "Open...").build(app_handle))
        .item(&MenuItemBuilder::with_id("import_file", "Import...").build(app_handle))
        .separator()
        .item(&MenuItemBuilder::with_id("save_file", "Save").build(app_handle))
        .item(&MenuItemBuilder::with_id("save_as_file", "Save As...").build(app_handle))
        .build()
        .expect("Failed to build file_menu");

    let edit_menu = SubmenuBuilder::new(app_handle, "Edit")
        .item(&MenuItemBuilder::with_id("undo", "Undo").build(app_handle))
        .item(&MenuItemBuilder::with_id("redo", "Redo").build(app_handle))
        .separator()
        .item(&MenuItemBuilder::with_id("cut", "Cut").build(app_handle))
        .item(&MenuItemBuilder::with_id("copy", "Copy").build(app_handle))
        .item(&MenuItemBuilder::with_id("paste", "Paste").build(app_handle))
        .build()
        .expect("Failed to build edit_menu");

    let debug_menu = SubmenuBuilder::new(app_handle, "Debug")
        .item(&MenuItemBuilder::with_id("add_sample_tempo_event", "Add Sample Tempo Event").build(app_handle))
        .item(&MenuItemBuilder::with_id("add_sample_time_signature_event", "Add Sample Time Signature Event").build(app_handle))
        .item(&MenuItemBuilder::with_id("add_doremiredo_notes", "Add 'DoReMiReDo' Notes").build(app_handle))
        .build()
        .expect("Failed to build debug_menu");

    let menu = MenuBuilder::new(app_handle)
        .items(&[&file_menu, &edit_menu, &debug_menu])
        .build()
        .expect("Failed to build application menu");

    menu
}
