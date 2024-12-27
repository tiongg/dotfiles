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

// TODO: Make this bindable
export function getNetworkLabel() {
  const type = network.primary ?? Network.Primary.WIFI;
  switch (type) {
    case Network.Primary.WIFI:
      return getWifiLabel(network.get_wifi()!);
    case Network.Primary.WIRED:
      return getWiredLabel(network.get_wired()!);
  }
}

export function getNetworkIcon() {
  return bind(network, 'primary').as(primary => {
    const icon =
      network[primary === Network.Primary.WIFI ? 'wifi' : 'wired']?.icon_name;
    return icon || '';
  });
}

export function NetworkIcon() {
  return <icon icon={getNetworkIcon()} />;
}

export function NetworkLabel() {
  return <label label={bind(network, 'primary').as(getNetworkLabel)} />;
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
