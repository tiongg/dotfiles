import IconText from '@/components/IconText';
import cn from '@/utils/cn';
import { bind } from 'astal';
import Bluetooth from 'gi://AstalBluetooth';
import Network from 'gi://AstalNetwork';
import Wp from 'gi://AstalWp';
import { getMicIcon, getMicLabel } from '../bar/MicDisplay';
import { getNetworkIcon, getNetworkLabel } from '../bar/NetworkDisplay';

// Uncomment when ready
// Clashes with agsv1
// const notifications = Notifd.get_default();
const audio = Wp.get_default()!;
const mic = audio.get_default_microphone()!;
const network = Network.get_default();
const bluetooth = Bluetooth.get_default();

function NetworkWidget() {
  return (
    <button className="cell size-two-one">
      <IconText
        className={bind(network, 'wifi').as(wifi => {
          const classes = ['toggle-button'];
          if (!wifi) return classes.join(' ');
          const { internet } = wifi;
          if (internet === Network.Internet.CONNECTED) {
            classes.push('active');
          }
          return classes.join(' ');
        })}
        icon={getNetworkIcon()}
        label={getNetworkLabel() ?? 'Unknown'}
        spacing={8}
      />
    </button>
  );
}

function BluetoothWidget() {
  return (
    <button className="cell size-two-one">
      <IconText
        className={bind(bluetooth, 'isConnected').as(isConnected => {
          return cn('toggle-button', isConnected ? 'active' : '');
        })}
        icon={bind(bluetooth, 'isConnected').as(isConnected => {
          return `bluetooth-${isConnected ? 'active' : 'disabled'}-symbolic`;
        })}
        label="Bluetooth"
        spacing={8}
      />
    </button>
  );
}

function DoNotDistrub() {
  // return Widget.Button({
  //   className: 'cell size-two-one',
  //   child: IconText({
  //     className: 'toggle-button',
  //     icon: 'weather-clear-night-symbolic',
  //     label: notification
  //       .bind('dnd')
  //       .as(active => (active ? 'Focused' : 'Focus')),
  //     spacing: 8,
  //     setup: self => {
  //       self.hook(notification, self => {
  //         self.toggleClassName('active', notification.dnd);
  //       });
  //     },
  //   }),
  //   onClicked: () => {
  //     notification.dnd = !notification.dnd;
  //   },
  // });
}

function MuteMic() {
  return (
    <button
      className="cell size-two-one"
      onClick={() => {
        mic.mute = !mic.mute;
      }}
    >
      <IconText
        className={bind(mic, 'mute').as(isMuted => {
          return cn('toggle-button', isMuted ? 'active' : '');
        })}
        icon={getMicIcon()}
        label={getMicLabel()}
        spacing={8}
      />
    </button>
  );
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
// TODO: Consider moving individual buttons out of this file
export default function SystemButtonsWidget() {
  return (
    <box className="system-buttons" spacing={8} vertical>
      <box spacing={8}>
        <NetworkWidget />
        <BluetoothWidget />
      </box>
      <box spacing={8}>
        {/* <DoNotDistrub /> */}
        <MuteMic />
      </box>
    </box>
  );
}
