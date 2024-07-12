import type { Wifi, Wired } from 'types/service/network';

const network = await Service.import('network');

function getWifiLabel(wifi: Wifi) {
  const { ssid, internet } = wifi;
  if (internet !== 'connected') return 'No Internet';
  return `${ssid}` ?? 'Unknown!';
}

function getWiredLabel(wired: Wired) {
  return 'Wired';
}

//TODO: Implement this function
function getNetworkLabel() {
  const type = network.primary ?? 'wifi';
  switch (type) {
    case 'wifi':
      return getWifiLabel(network[type]);
    case 'wired':
      return getWiredLabel(network[type]);
  }
}

/**
 * Icon display for network
 */
export default function NetworkDisplay() {
  const NetworkIcon = Widget.Icon().hook(network, (self) => {
    const icon = network[network.primary ?? 'wifi']?.icon_name;
    self.icon = icon || '';
    self.visible = !!icon;
  });

  const NetworkLabel = Widget.Label().hook(network, (self) => {
    self.label = getNetworkLabel();
  });

  return Widget.Box({
    spacing: 4,
    children: [NetworkIcon, NetworkLabel],
  });
}
