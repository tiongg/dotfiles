import brightness from '@/services/brightness.service';

function getBrightnessIcon(screen: number) {
  if (screen < 0.34) {
    return 'brightness-low-symbolic';
  }
  if (screen < 0.67) {
    return 'brightness-medium-symbolic';
  }
  return 'brightness-high-symbolic';
}

/**
 * Icon for current brightness. Changes based on brightness level
 */
export function BrightnessIcon() {
  return Widget.Icon({
    className: 'brightness-icon',
    icon: brightness.bind('screen').as(getBrightnessIcon),
  });
}

/**
 * Text for current brightness. Changes based on brightness level
 */
export function BrightnessText() {
  return Widget.Label({
    className: 'brightness-text',
    label: brightness
      .bind('screen')
      .as((screen) => `${Math.round(screen * 100)}%`),
  });
}

/**
 * Bar display for brightness
 */
export default function BrightnessDisplay() {
  const delta = 0.005;

  return Widget.EventBox({
    child: Widget.Box({
      spacing: 4,
      children: [BrightnessIcon(), BrightnessText()],
    }),
    onScrollDown: () => {
      brightness.screen += delta;
    },
    onScrollUp: () => {
      brightness.screen -= delta;
    },
  });
}
