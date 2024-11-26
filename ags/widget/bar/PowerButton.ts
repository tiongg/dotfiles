import { bash } from '@/utils/utils';

function powerScript() {
  bash('$HOME/.config/hypr/scripts/wlogout.sh');
}

/**
 * Power button display
 */
export default function PowerButton() {
  const isHovering = Variable(false);

  return Widget.EventBox({
    cursor: 'pointer',
    child: Widget.Icon({
      className: isHovering.bind().as((hovering) => (hovering ? 'hover' : '')),
      icon: 'system-shutdown',
    }),
    onHover: () => isHovering.setValue(true),
    onHoverLost: () => isHovering.setValue(false),
    onPrimaryClick: () => {
      powerScript();
      isHovering.setValue(false);
    },
  });
}
