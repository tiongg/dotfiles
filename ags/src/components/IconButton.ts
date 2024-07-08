import iconPath from '@/utils/icon-path';
import { ButtonProps } from 'types/widgets/button';

export type IconButtonProps = Omit<ButtonProps, 'child'> & {
  /**
   * Icon name
   */
  icon: string;

  /**
   * Automatically resolve to icons directory
   */
  resolveToDirectory?: boolean;
};

/**
 * Button with an icon
 */
export default function IconButton({
  icon,
  resolveToDirectory = true,
  ...buttonProps
}: IconButtonProps) {
  return Widget.Button({
    child: Widget.Icon({
      icon: resolveToDirectory ? iconPath(icon) : icon,
    }),
    ...buttonProps,
  });
}
