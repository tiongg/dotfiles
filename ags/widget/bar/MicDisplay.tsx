import { bind } from 'astal';
import Wp from 'gi://AstalWp';

const microphone = Wp.get_default()!.audio.defaultMicrophone;

export function MicIcon() {
  return (
    <icon
      className="icon"
      icon={bind(microphone, 'mute').as(muted =>
        muted
          ? 'microphone-sensitivity-muted-symbolic'
          : 'microphone-sensitivity-high-symbolic'
      )}
    />
  );
}

export function MicLabel() {
  return (
    <label>
      {bind(microphone, 'mute').as(muted => (muted ? 'Unmute' : 'Mute'))}
    </label>
  );
}

/**
 * Icon display for microphone
 */
export default function MicDisplay() {
  return (
    <box spacing={4}>
      {MicIcon()}
      {MicLabel()}
    </box>
  );
}
