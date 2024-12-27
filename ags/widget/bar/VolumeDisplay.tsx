import { bind, Variable } from 'astal';
import Wp from 'gi://AstalWp';
import _ from 'lodash';

const speaker = Wp.get_default()!.audio?.get_default_speaker()!;

function getVolumeIcon(volume: number, mute: boolean) {
  const vol = mute ? 0 : volume * 100;

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
  const icon = Variable.derive(
    [bind(speaker, 'volume'), bind(speaker, 'mute')],
    (volume, mute) => getVolumeIcon(volume, mute)
  );

  return <icon className="volume-icon" icon={bind(icon)} />;
}

/**
 * Text for current volume. Changes based on volume level
 */
export function VolumeText() {
  return (
    <label
      className="volume-text"
      label={bind(speaker, 'volume').as(
        volume => `${Math.round(volume * 100)}%`
      )}
    />
  );
}

/**
 * Bar display for volume
 */
export default function VolumeDisplay() {
  return (
    <eventbox
      onScroll={(_self, e) => {
        const { volume } = speaker;
        speaker.volume = _.clamp(volume - 0.05 * e.delta_y, 0, 1);
      }}
      className={bind(speaker, 'mute').as(mute =>
        mute ? 'muted volume-display' : 'volume-display'
      )}
    >
      <box spacing={4}>
        <VolumeIcon />
        <VolumeText />
      </box>
    </eventbox>
  );
}
