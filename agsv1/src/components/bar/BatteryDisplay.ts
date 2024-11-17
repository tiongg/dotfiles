import IconText from '../IconText';

// const battery = await Service.import('battery');
import battery from '@/services/battery.service';

/**
 * Bar display for battery
 */
export default function BatteryDisplay() {
  return IconText({
    icon: battery.bind('icon_name'),
    label: battery.bind('percent').as((percent) => `${percent}%`),
  });
}
