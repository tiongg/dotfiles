import IconText from '@/components/IconText';
import { bind } from 'astal';
import Battery from 'gi://AstalBattery';

const battery = Battery.get_default();

/**
 * Bar display for battery
 */
export default function BatteryDisplay() {
  return (
    <IconText
      icon={bind(battery, 'batteryIconName')}
      label={bind(battery, 'percentage').as(
        percent => `${Math.round(percent * 100)}%`
      )}
    />
  );
}
