import type { Binding } from 'astal';
import { ButtonProps } from 'astal/gtk3/widget';

export type IconButtonProps = Omit<ButtonProps, 'child'> & {
  /**
   * Icon name
   */
  icon: string | Binding<string>;
};

/**
 * Button with an icon
 */
export default function IconButton({ icon, ...buttonProps }: IconButtonProps) {
  return (
    <button {...buttonProps}>
      <icon icon={icon} />
    </button>
  );
}
