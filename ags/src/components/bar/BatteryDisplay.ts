const battery = await Service.import('battery');

/**
 * Bar display for battery
 */
export default function BatteryDisplay() {
  return Widget.Box({
    spacing: 4,
    children: [
      Widget.Icon({
        icon: battery.bind('icon_name'),
      }),
      Widget.Label({
        label: battery.bind('percent').as((percent) => `${percent}%`),
      }),
    ],
  });
}
