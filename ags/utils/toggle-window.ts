import { Windows } from '@/constants/windows.type';
import { App } from 'astal/gtk3';

/**
 * Toggles a popup window
 * @param window - The name of the window to toggle
 */
export function toggleWindow(window: Windows) {
  // Eventually I will have to centralize all popup logic here
  // Currently, hiding the window doesn't play the correct animation
  App.toggle_window(window);
}
