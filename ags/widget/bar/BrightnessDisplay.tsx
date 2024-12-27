import { bind } from 'astal';

import { SCROLL_DELTA } from '@/constants/variables';
import Brightness from '@/services/brightness.service';
const brightness = Brightness.get_default();

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
  return (
    <icon
      className="brightness-icon"
      icon={bind(brightness, 'screen').as(getBrightnessIcon)}
    />
  );
}

/**
 * Text for current brightness. Changes based on brightness level
 */
export function BrightnessText() {
  return (
    <label
      className="brightness-text"
      label={bind(brightness, 'screen').as(
        screen => `${Math.round(screen * 100)}%`
      )}
    />
  );
}

/**
 * Bar display for brightness
 */
export default function BrightnessDisplay() {
  return (
    <eventbox
      onScroll={(_self, e) => {
        brightness.screen -= e.delta_y * SCROLL_DELTA;
      }}
    >
      <box spacing={4}>
        <BrightnessIcon />
        <BrightnessText />
      </box>
    </eventbox>
  );
}
