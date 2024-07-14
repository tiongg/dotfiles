import { uptime } from '@/constants/variables';
import { sh } from '@/utils/utils';
import Gtk from 'gi://Gtk?version=3.0';
import IconButton, { IconButtonProps } from '../IconButton';
import BatteryDisplay from '../bar/BatteryDisplay';

// Currently just returns the pfp
// ...its hardcoded
function CurrentUser() {
  return Widget.Icon({
    className: 'current-user',
    css: `background-image: url('/home/${Utils.USER}/.config/wallpaper/pfp.png');`,
    // Size set in CSS
  });
}

// Shows the uptime in hours and minutes
function uptimeString(up: number) {
  const h = Math.floor(up / 60);
  const m = Math.floor(up % 60);
  return `${h}h ${m < 10 ? '0' + m : m}m`;
}

function Uptime() {
  return Widget.Box({
    halign: Gtk.Align.START,
    spacing: 4,
    vpack: 'center',
    children: [
      Widget.Icon({
        icon: 'hourglass-symbolic',
      }),
      Widget.Label({
        label: uptime.bind().as(uptimeString),
      }),
    ],
  });
}

/**
 * Shows battery & uptime
 */
function SystemStatus() {
  return Widget.Box({
    vertical: true,
    hexpand: true,
    vpack: 'center',
    spacing: 4,
    children: [BatteryDisplay(), Uptime()],
  });
}

function ActionButton({ ...rest }: IconButtonProps) {
  return IconButton({
    className: 'action-button',
    widthRequest: 38,
    heightRequest: 38,
    expand: false,
    ...rest,
  });
}

/**
 * Buttons to power off, restart, sleep
 */
function PowerOptions() {
  return Widget.Box({
    halign: Gtk.Align.END,
    spacing: 4,
    vpack: 'center',
    children: [
      ActionButton({
        icon: 'weather-clear-night-symbolic',
        onPrimaryClick: () => sh('systemctl suspend'),
      }),
      ActionButton({
        //TODO: LOOK FOR A DIFFERNT ICON
        icon: 'system-reboot-symbolic',
        onPrimaryClick: () => sh('reboot'),
      }),
      ActionButton({
        icon: 'system-shutdown-symbolic',
        onPrimaryClick: () => sh('shutdown now'),
      }),
    ],
  });
}

/**
 * Widget to show system related status
 *
 * Contains:
 * - Current User
 * - Battery status
 * - Uptime
 * - Power off/Restart/Sleep
 */
export default function SystemStatusWidget() {
  return Widget.Box({
    className: 'system-status-widget',
    spacing: 8,
    hexpand: true,
    children: [CurrentUser(), SystemStatus(), PowerOptions()],
  });
}
