import { SCROLL_DELTA } from '@/constants/variables';
import brightness from '@/services/brightness.service';
import Gtk from 'gi://Gtk?version=3.0';
import { BrightnessIcon, BrightnessText } from '../bar/BrightnessDisplay';
import { VolumeIcon, VolumeText } from '../bar/VolumeDisplay';

const audio = await Service.import('audio');

function BrightnessSlider() {
  const CircularBrightness = Widget.CircularProgress({
    className: 'circular-progress',
    rounded: true,
    startAt: 0.75, //top
    value: brightness.bind('screen'),
    child: Widget.Box({
      className: 'circular-progress-inner',
      spacing: 4,
      vertical: true,
      valign: Gtk.Align.CENTER,
      children: [BrightnessIcon(), BrightnessText()],
    }),
  });

  return Widget.EventBox({
    child: Widget.Box({
      className: 'size-two cell',
      halign: Gtk.Align.START,
      children: [
        Widget.Box({ hexpand: true }),
        CircularBrightness,
        Widget.Box({ hexpand: true }),
      ],
    }),
    onScrollDown: () => {
      brightness.screen -= SCROLL_DELTA;
    },
    onScrollUp: () => {
      brightness.screen += SCROLL_DELTA;
    },
  });
}

function VolumeSlider() {
  const CircularVolume = Widget.CircularProgress({
    className: 'circular-progress',
    rounded: true,
    startAt: 0.75, //top
    child: Widget.Box({
      className: 'circular-progress-inner',
      spacing: 4,
      vertical: true,
      valign: Gtk.Align.CENTER,
      children: [VolumeIcon(), VolumeText()],
    }),
  }).hook(audio.speaker, (self) => {
    self.value = audio.speaker.volume;
  });

  return Widget.EventBox({
    child: Widget.Box({
      className: 'size-two cell',
      halign: Gtk.Align.START,
      children: [
        Widget.Box({ hexpand: true }),
        CircularVolume,
        Widget.Box({ hexpand: true }),
      ],
    }),
    onPrimaryClick: () => {
      audio.speaker.is_muted = !audio.speaker.is_muted;
    },
    onScrollDown: () => {
      const { volume } = audio.speaker;
      audio.speaker.volume = Math.max(0, volume - SCROLL_DELTA);
    },
    onScrollUp: () => {
      const { volume } = audio.speaker;
      audio.speaker.volume = Math.min(volume + SCROLL_DELTA, 1);
    },
  });
}

/**
 * Widgets that use sliders as input
 *
 * Contains:
 * - Volume
 * - Brightness
 */
export default function SystemSlidersWidget() {
  return Widget.Box({
    className: 'system-sliders',
    spacing: 16,
    children: [VolumeSlider(), BrightnessSlider()],
  });
}
