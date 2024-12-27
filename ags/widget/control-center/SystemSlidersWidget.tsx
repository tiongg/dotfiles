import { SCROLL_DELTA } from '@/constants/variables';
import Brightness from '@/services/brightness.service';
import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import Wp from 'gi://AstalWp';
import _ from 'lodash';
import { BrightnessIcon, BrightnessText } from '../bar/BrightnessDisplay';
import { VolumeIcon, VolumeText } from '../bar/VolumeDisplay';

const audio = Wp.get_default()!;
const speaker = audio.get_default_speaker()!;
const brightness = Brightness.get_default();

function BrightnessSlider() {
  return (
    <eventbox
      hexpand={false}
      onScroll={(_self, e) => {
        brightness.screen -= e.delta_y * SCROLL_DELTA;
      }}
    >
      <box className="size-two cell" halign={Gtk.Align.START}>
        <box hexpand />
        <circularprogress
          className="circular-progress"
          rounded
          startAt={0.75}
          endAt={0.75}
          value={bind(brightness, 'screen')}
        >
          <box
            className="circular-progress-inner"
            spacing={4}
            vertical
            valign={Gtk.Align.CENTER}
          >
            <BrightnessIcon />
            <BrightnessText />
          </box>
        </circularprogress>
        <box hexpand />
      </box>
    </eventbox>
  );
}

function VolumeSlider() {
  return (
    <eventbox
      hexpand={false}
      onClick={() => {
        speaker.set_mute(!speaker.get_mute());
      }}
      onScroll={(_self, e) => {
        const { volume } = speaker;
        speaker.volume = _.clamp(volume - 0.05 * e.delta_y, 0, 1);
      }}
    >
      <box className="size-two cell" halign={Gtk.Align.START}>
        <box hexpand />
        <circularprogress
          className="circular-progress"
          rounded
          startAt={0.75}
          endAt={0.75}
          value={bind(speaker, 'volume')}
        >
          <box
            className="circular-progress-inner"
            spacing={4}
            vertical
            valign={Gtk.Align.CENTER}
          >
            <VolumeIcon />
            <VolumeText />
          </box>
        </circularprogress>
        <box hexpand />
      </box>
    </eventbox>
  );
}

/**
 * Widgets that use sliders as input
 *
 * Contains:
 * - Volume
 * - Brightness
 */
export default function SystemSlidersWidget() {
  return (
    <box className="system-sliders" spacing={8}>
      <VolumeSlider />
      <BrightnessSlider />
    </box>
  );
}
