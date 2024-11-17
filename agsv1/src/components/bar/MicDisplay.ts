const audio = await Service.import('audio');

export function MicIcon() {
  return Widget.Icon({
    className: 'icon',
  }).hook(audio.microphone, (self) => {
    self.icon = audio.microphone.is_muted
      ? 'microphone-sensitivity-muted-symbolic'
      : 'microphone-sensitivity-high-symbolic';
  });
}

export function MicLabel() {
  return Widget.Label().hook(audio.microphone, (self) => {
    self.label = audio.microphone.is_muted ? 'Unmute' : 'Mute';
  });
}

/**
 * Icon display for microphone
 */
export default function MicDisplay() {
  return Widget.Box({
    spacing: 4,
    children: [MicIcon(), MicLabel()],
  });
}
