/**
 * Widget use buttons/toggle buttons/menus as input
 *
 * Contains:
 * - Mute mic (Toggle)
 * - Do not disturb (Toggle)
 * - Network (Menu)
 * - Bluetooth (Menu)
 */
export default function SystemButtonsWidget() {
  return Widget.Box({
    className: 'system-buttons-widget',
    spacing: 8,
  });
}
