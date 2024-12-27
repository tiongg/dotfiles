import { bind } from 'astal';
import Wp from 'gi://AstalWp';

const microphone = Wp.get_default()!.audio.defaultMicrophone;

/**
 * Get mic icon, muted or unmuted
 * @returns binding, 'microphone-sensitivity-muted-symbolic' or 'microphone-sensitivity-high-symbolic'
 */
export function getMicIcon() {
  return bind(microphone, 'mute').as(muted =>
    muted
      ? 'microphone-sensitivity-muted-symbolic'
      : 'microphone-sensitivity-high-symbolic'
  );
}

/**
 * Get mic action status, 'Mute' or 'Unmute'
 * @returns binding, 'Mute' or 'Unmute'
 */
export function getMicLabel() {
  return bind(microphone, 'mute').as(muted => (muted ? 'Unmute' : 'Mute'));
}

/**
 * Mic icon widget
 */
export function MicIcon() {
  return <icon className="icon" icon={getMicIcon()} />;
}

/**
 * Mic label widget, muted or unmuted
 */
export function MicLabel() {
  return <label>{getMicLabel()}</label>;
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
