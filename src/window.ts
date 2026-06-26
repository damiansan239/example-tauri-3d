import { getCurrentWindow } from '@tauri-apps/api/window';

const win = getCurrentWindow();

/** Make the window draggable from any point on mousedown */
export async function enableDrag() {
  try {
    await win.startDragging();
  } catch (err) {
    console.error('Failed to start window dragging:', err);
  }
}

/**
 * Click-through: pointer events pass to the desktop.
 * forward: true = mouse position still updates (needed for hover effects).
 */
export async function setClickThrough(enabled: boolean) {
  try {
    await win.setIgnoreCursorEvents(enabled);
  } catch (err) {
    console.error('Failed to set click through:', err);
  }
}

/** Pin / unpin above all windows */
export async function setAlwaysOnTop(enabled: boolean) {
  try {
    await win.setAlwaysOnTop(enabled);
  } catch (err) {
    console.error('Failed to set always on top:', err);
  }
}
