import Gdk from 'gi://Gdk';
import GLib from 'gi://GLib?version=2.0';
import Gtk from 'gi://Gtk?version=3.0';
import _ from 'lodash';

/**
 * Execute Bash command(s)
 * @param commands - Command(s) to execute
 * @param args - Arguments to pass to the command(s). Maps to the commands at the same index
 * @returns Bash command output
 */
export async function bash(commands: string | string[], ...args: unknown[]) {
  //Map commands to args
  const cmd = Array.isArray(commands)
    ? commands.map((c, i) => `${c} ${args[i] ?? ''}`).join(' ')
    : commands;

  return Utils.execAsync(['bash', '-c', cmd]);
}

/**
 * Run a shell command
 * @param cmd - Command to run
 * @returns Shell command output
 */
export async function sh(cmd: string | string[]) {
  return Utils.execAsync(cmd);
}

/**
 * Creates an individual widget for each monitor
 * @param widget - Widget that takes in monitor index
 * @returns Array of widgets for each monitor
 */
export function forMonitors(widget: (monitor: number) => Gtk.Window) {
  const monitors = Gdk.Display.get_default()?.get_n_monitors() || 1;
  return _.range(monitors).flatMap(widget);
}

/**
 * Checks if icon exists, if not return fallback
 * @returns icon or fallback
 */
export function iconOrFallback(
  icon: string | null,
  fallback = 'image-missing-symbolic'
) {
  if (!icon) return fallback;
  if (GLib.file_test(icon, GLib.FileTest.EXISTS)) return icon;
  if (Utils.lookUpIcon(icon)) return icon;
  return fallback;
}
