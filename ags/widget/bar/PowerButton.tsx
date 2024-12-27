import { bash } from '@/utils/utils';
import { Variable, bind } from 'astal';

function powerScript() {
  bash('$HOME/.config/hypr/scripts/wlogout.sh');
}

/**
 * Power button display
 */
export default function PowerButton() {
  const isHovering = Variable(false);

  return (
    <eventbox
      cursor="pointer"
      onHover={() => {
        isHovering.set(true);
      }}
      onHoverLost={() => {
        isHovering.set(false);
      }}
      onPrimaryClick={() => {
        powerScript();
        isHovering.set(false);
      }}
    >
      <icon
        className={bind(isHovering).as(hovering => (hovering ? 'hover' : ''))}
        icon="system-shutdown"
      />
    </eventbox>
  );
}
