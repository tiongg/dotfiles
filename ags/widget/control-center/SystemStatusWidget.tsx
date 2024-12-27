import IconButton, { IconButtonProps } from '@/components/IconButton';
import IconText from '@/components/IconText';
import { CONFIG, USER } from '@/constants/environment';
import { uptime } from '@/constants/variables';
import { sh } from '@/utils/utils';
import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';

// Currently just returns the pfp
// ...its hardcoded
function CurrentUserImage() {
  return (
    <icon
      className="current-user"
      css={`
        background-image: url('${CONFIG}/wallpaper/pfp.png');
      `}
      // Size set in CSS
    />
  );
}

function CurrentUsername() {
  return (
    <IconText
      className="current-username"
      icon="avatar-default-symbolic"
      label={USER}
    />
  );
}

// Shows the uptime in hours and minutes
function uptimeString(up: number) {
  const h = Math.floor(up / 60);
  const m = Math.floor(up % 60);
  return `${h}h ${m < 10 ? '0' + m : m}m`;
}

function Uptime() {
  return (
    <IconText
      icon="hourglass-symbolic"
      label={bind(uptime).as(uptime => uptimeString(uptime))}
      halign={Gtk.Align.START}
      // vpack="center"
    />
  );
}

/**
 * Top widget
 */
function SystemStatus() {
  return (
    <box spacing={4} vertical hexpand valign={Gtk.Align.CENTER}>
      <CurrentUsername />
      <Uptime />
    </box>
  );
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
  return (
    <box spacing={4} halign={Gtk.Align.END} valign={Gtk.Align.CENTER}>
      <ActionButton
        icon="weather-clear-night-symbolic"
        onClick={() => sh('systemctl suspend')}
      />
      <ActionButton icon="restart-symbolic" onClick={() => sh('reboot')} />
      <ActionButton
        icon="system-shutdown-symbolic"
        onClick={() => sh('shutdown now')}
      />
    </box>
  );
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
  return (
    <box
      className="system-status-widget"
      spacing={8}
      hexpand={false}
      valign={Gtk.Align.CENTER}
    >
      <CurrentUserImage />
      <SystemStatus />
      <PowerOptions />
    </box>
  );
}
