import IconText from '../IconText';
import { NetworkIcon, NetworkLabel } from '../bar/NetworkDisplay';

const notification = await Service.import('notifications');

function Network() {
  return Widget.Button({
    className: 'cell size-two-one',
    child: Widget.Box({
      className: 'toggle-button',
      spacing: 8,
      children: [NetworkIcon(), NetworkLabel()],
    }),
    onClicked: () => {},
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
      label: 'Focus',
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
    child: IconText({
      className: 'toggle-button',
      icon: 'microphone-sensitivity-muted',
      label: 'Mute',
      spacing: 8,
      setup: (self) => {},
    }),
    onClicked: () => {},
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
