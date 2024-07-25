import cn from '@/utils/cn';
import IconText from '../IconText';
import { MicIcon, MicLabel } from '../bar/MicDisplay';
import { NetworkIcon, NetworkLabel } from '../bar/NetworkDisplay';

const notification = await Service.import('notifications');
const audio = await Service.import('audio');
const network = await Service.import('network');

function Network() {
  return Widget.Button({
    className: 'cell size-two-one',
    child: Widget.Box({
      className: network.bind('primary').as((primary) => {
        if (!primary) return 'toggle-button';
        const { internet } = network[primary];
        return cn('toggle-button', internet === 'connected' ? 'active' : '');
      }),
      spacing: 8,
      children: [NetworkIcon(), NetworkLabel()],
    }),
  });
}

function Bluetooth() {
  return Widget.Button({
    className: 'cell size-two-one',
    child: IconText({
      className: 'toggle-button',
      icon: 'bluetooth-active-symbolic',
      label: 'Bluetooth',
      spacing: 8,
    }),
    onClicked: () => {},
  });
}

function DoNotDistrub() {
  return Widget.Button({
    className: 'cell size-two-one',
    child: IconText({
      className: 'toggle-button',
      icon: 'weather-clear-night-symbolic',
      label: notification
        .bind('dnd')
        .as((active) => (active ? 'Focused' : 'Focus')),
      spacing: 8,
      setup: (self) => {
        self.hook(notification, (self) => {
          self.toggleClassName('active', notification.dnd);
        });
      },
    }),
    onClicked: () => {
      notification.dnd = !notification.dnd;
    },
  });
}

function MuteMic() {
  return Widget.Button({
    className: 'cell size-two-one',
    child: Widget.Box({
      className: 'toggle-button',
      spacing: 8,
      children: [MicIcon(), MicLabel()],
      setup: (self) => {
        self.hook(audio, (self) => {
          self.toggleClassName('active', audio.microphone.is_muted ?? false);
        });
      },
    }),
    onClicked: () => {
      audio.microphone.is_muted = !audio.microphone.is_muted;
    },
  });
}

/**
 * Widget use buttons/toggle buttons/menus as input
 *
 * Contains:
 * - Network (Menu)
 * - Bluetooth (Menu)
 * - Mute mic (Toggle)
 * - Do not disturb (Toggle)
 */
export default function SystemButtonsWidget() {
  return Widget.Box({
    className: 'system-buttons',
    spacing: 8,
    vertical: true,
    children: [
      Widget.Box({
        spacing: 8,
        children: [Network(), Bluetooth()],
      }),
      Widget.Box({
        spacing: 8,
        children: [DoNotDistrub(), MuteMic()],
      }),
    ],
  });
}
