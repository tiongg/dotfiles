import { iconOrFallback } from '@/utils/utils';
import { bind } from 'astal';
import Network from 'gi://AstalNetwork';

const network = Network.get_default();

function getWifiLabel(wifi: Network.Wifi) {
  const { ssid, internet } = wifi;
  switch (internet) {
    case Network.Internet.CONNECTED:
      return ssid;
    case Network.Internet.CONNECTING:
      return 'Connecting...';
    case Network.Internet.DISCONNECTED:
      return 'No Internet';
  }
}

//TODO: Implement this function
function getWiredLabel(wired: Network.Wired) {
  return 'Wired';
}

export function getNetworkLabel() {
  // return bind(network, 'primary').as(primary => {
  //   switch (primary) {
  //     case Network.Primary.WIFI:
  //       return getWifiLabel(network.get_wifi()!);
  //     case Network.Primary.WIRED:
  //       return getWiredLabel(network.get_wired()!);
  //   }
  //   return 'Unknown';
  // });
  return bind(network, 'wifi').as(wifi => {
    if (wifi) {
      return getWifiLabel(wifi);
    }
    return 'Unknown';
  });
}

export function getNetworkIcon() {
  return bind(network, 'wifi').as(wifi => {
    return iconOrFallback(wifi?.iconName);
  });
}

export function NetworkIcon() {
  return <icon icon={getNetworkIcon()} />;
}

export function NetworkLabel() {
  return <label label={getNetworkLabel()} />;
}

/**
 * Icon display for network
 */
export default function NetworkDisplay() {
  return (
    <box spacing={4}>
      <NetworkIcon />
      <NetworkLabel />
    </box>
  );
}
