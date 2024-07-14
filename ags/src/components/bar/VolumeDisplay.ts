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
 * Bar display for volume
 */
export default function VolumeDisplay() {
  const VolumeIcon = Widget.Icon().hook(audio.speaker, (self) => {
    self.icon = getVolumeIcon();
  });

  const VolumeText = Widget.Label().hook(audio.speaker, (self) => {
    const { volume, is_muted } = audio.speaker;
    const vol = is_muted ? 0 : volume;
    self.label = `${Math.round(vol * 100)}%`;
  });

  return Widget.EventBox({
    child: Widget.Box({
      spacing: 4,
      children: [VolumeIcon, VolumeText],
    }),
    onScrollDown: () => {
      const { volume } = audio.speaker;
      audio.speaker.volume = Math.max(0, volume - 0.005);
    },
    onScrollUp: () => {
      const { volume } = audio.speaker;
      audio.speaker.volume = Math.min(volume + 0.005, 1);
    },
  }).hook(audio.speaker, (self) => {
    self.toggleClassName('muted', audio.speaker.is_muted ?? true);
  });
}
