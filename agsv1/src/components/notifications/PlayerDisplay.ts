import { type MprisPlayer } from 'types/service/mpris';

// const mpris = await Service.import('mpris');

function TitleDisplay(player: MprisPlayer) {
  const title = Utils.merge(
    [player.bind('track_title'), player.bind('play_back_status')],
    (trackTitle, playBackStatus) => {
      if (playBackStatus === 'Playing') return trackTitle;
      return `${playBackStatus} - ${trackTitle}`;
    }
  );

  return Widget.Label({
    label: title,
    maxWidthChars: 30,
    truncate: 'end',
  });
}

/**
 * Displays current mpris player information
 */
export default function PlayerDisplay() {
  return Widget.Box({
    className: 'player-display',
    // child: mpris.bind('players').as((players) => {
    //   const player = players[0];
    //   if (!player) return Widget.Box();
    //   return TitleDisplay(player);
    // }),
  });
}
