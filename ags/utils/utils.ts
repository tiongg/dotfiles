import { GLib } from 'astal';
import { Astal } from 'astal/gtk3';
import { execAsync } from 'astal/process';

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

  return execAsync(['bash', '-c', cmd]);
}

/**
 * Run a shell command
 * @param cmd - Command to run
 * @returns Shell command output
 */
export async function sh(cmd: string | string[]) {
  return execAsync(cmd);
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
  if (Astal.Icon.lookup_icon(icon)) return icon;
  return fallback;
}
