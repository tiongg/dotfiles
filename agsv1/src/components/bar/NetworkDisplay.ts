import type { Wifi, Wired } from 'types/service/network';

const network = await Service.import('network');

function getWifiLabel(wifi: Wifi) {
  const { ssid, internet } = wifi;
  if (internet !== 'connected') return 'Offline';
  return `${ssid}` ?? 'Unknown!';
}

//TODO: Implement this function
function getWiredLabel(wired: Wired) {
  return 'Wired';
}

function getNetworkLabel() {
  const type = network.primary ?? 'wifi';
  switch (type) {
    case 'wifi':
      return getWifiLabel(network[type]);
    case 'wired':
      return getWiredLabel(network[type]);
  }
}

export function NetworkIcon() {
  return Widget.Icon({
    className: 'icon',
  }).hook(network, (self) => {
    const icon = network[network.primary ?? 'wifi']?.icon_name;
    self.icon = icon || '';
    self.visible = !!icon;
  });
}

export function NetworkLabel() {
  return Widget.Label().hook(network, (self) => {
    self.label = getNetworkLabel();
  });
}

/**
 * Icon display for network
 */
export default function NetworkDisplay() {
  return Widget.Box({
    spacing: 4,
    children: [NetworkIcon(), NetworkLabel()],
  });
}
