import { ButtonProps } from 'types/widgets/button';

export type IconButtonProps = Omit<ButtonProps, 'child'> & {
  /**
   * Icon name
   */
  icon: string;
};

/**
 * Button with an icon
 */
export default function IconButton({ icon, ...buttonProps }: IconButtonProps) {
  return Widget.Button({
    child: Widget.Icon({
      icon,
    }),
    ...buttonProps,
  });
}
