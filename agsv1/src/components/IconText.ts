import { Binding } from 'types/service';
import { BoxProps } from 'types/widgets/box';

export type IconTextProps = Omit<BoxProps, 'children'> & {
  /**
   * Icon to display
   */
  icon: string | Binding<any, any, string>;

  /**
   * Label to display
   */
  label: string | Binding<any, any, string>;
};

/**
 * Label with an icon infront
 */
export default function IconText({ icon, label, ...rest }: IconTextProps) {
  rest.spacing ??= 4;

  return Widget.Box({
    children: [
      Widget.Icon({
        className: 'icon',
        icon,
      }),
      Widget.Label({ label }),
    ],
    ...rest,
  });
}
