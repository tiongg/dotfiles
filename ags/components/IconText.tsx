import { Binding } from 'astal';
import { BoxProps } from 'astal/gtk3/widget';

export type IconTextProps = Omit<BoxProps, 'children'> & {
  /**
   * Icon to display
   */
  icon: string | Binding<string>;

  /**
   * Label to display
   */
  label: string | Binding<string>;
};

/**
 * Label with an icon infront
 */
export default function IconText({ icon, label, ...rest }: IconTextProps) {
  rest.spacing ??= 4;

  return (
    <box {...rest}>
      <icon className="icon" icon={icon} />
      <label label={label} />
    </box>
  );
}
