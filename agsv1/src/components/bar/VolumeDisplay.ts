import { SCROLL_DELTA } from '@/constants/variables';

const audio = await Service.import('audio');

function getVolumeIcon() {
  const { volume, is_muted } = audio.speaker;
  const vol = is_muted ? 0 : volume * 100;

  // Scuffed binary search
  if (vol <= 34) {
    if (vol === 0) {
      return 'audio-volume-muted';
    } else {
      return 'audio-volume-low';
    }
  } else {
    if (vol <= 67) {
      return 'audio-volume-medium';
    } else {
      return 'audio-volume-high';
    }
  }
}

/**
 * Icon for current volume. Changes based on volume level
 */
export function VolumeIcon() {
  return Widget.Icon({
    className: 'volume-icon',
  }).hook(audio.speaker, (self) => {
    self.icon = getVolumeIcon();
  });
}

/**
 * Text for current volume. Changes based on volume level
 */
export function VolumeText() {
  return Widget.Label({
    className: 'volume-text',
  }).hook(audio.speaker, (self) => {
    const { volume } = audio.speaker;
    self.label = `${Math.round(volume * 100)}%`;
  });
}

/**
 * Bar display for volume
 */
export default function VolumeDisplay() {
  return Widget.EventBox({
    child: Widget.Box({
      spacing: 4,
      children: [VolumeIcon(), VolumeText()],
    }),
    onScrollDown: () => {
      const { volume } = audio.speaker;
      audio.speaker.volume = Math.max(0, volume - SCROLL_DELTA);
    },
    onScrollUp: () => {
      const { volume } = audio.speaker;
      audio.speaker.volume = Math.min(volume + SCROLL_DELTA, 1);
    },
  }).hook(audio.speaker, (self) => {
    self.toggleClassName('muted', audio.speaker.is_muted ?? true);
  });
}
