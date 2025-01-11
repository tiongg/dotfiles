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

/**
 * Get relative time from now
 * @param date - Date to compare
 * @returns Relative time from now, e.g. "2 days ago"
 */
export function getRelativeTime(date: Date) {
  const now = Date.now();
  const diff = date.getTime() - now;
  const seconds = Math.abs(Math.floor(diff / 1000));
  const minutes = Math.abs(Math.floor(seconds / 60));
  const hours = Math.abs(Math.floor(minutes / 60));
  const days = Math.abs(Math.floor(hours / 24));
  const years = Math.abs(Math.floor(days / 365));

  if (Math.abs(diff) < 1000) return 'just now';

  const isFuture = diff > 0;

  if (years > 0)
    return `${isFuture ? 'in ' : ''}${years} ${years === 1 ? 'year' : 'years'}${isFuture ? '' : ' ago'}`;
  if (days > 0)
    return `${isFuture ? 'in ' : ''}${days} ${days === 1 ? 'day' : 'days'}${isFuture ? '' : ' ago'}`;
  if (hours > 0)
    return `${isFuture ? 'in ' : ''}${hours} ${hours === 1 ? 'hour' : 'hours'}${isFuture ? '' : ' ago'}`;
  if (minutes > 0)
    return `${isFuture ? 'in ' : ''}${minutes} ${minutes === 1 ? 'minute' : 'minutes'}${isFuture ? '' : ' ago'}`;

  return `${isFuture ? 'in ' : ''}${seconds} ${seconds === 1 ? 'second' : 'seconds'}${isFuture ? '' : ' ago'}`;
}

/**
 * Checks if a given GLib.DateTime is today
 */
export function isToday(date: GLib.DateTime) {
  const now = GLib.DateTime.new_now_local();
  return (
    now.get_day_of_month() === date.get_day_of_month() &&
    now.get_month() === date.get_month() &&
    now.get_year() === date.get_year()
  );
}
