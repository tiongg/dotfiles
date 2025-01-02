import { sh } from '@/utils/utils';
import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import Hyprland from 'gi://AstalHyprland';
import _ from 'lodash';

const hyprland = Hyprland.get_default();

function changeWorkspace(workspace: number) {
  sh(`hyprctl dispatch workspace ${workspace}`);
}

type WorkSpaceProps = {
  workspace: number;
};

/**
 * Individual workspace
 */
function Workspace({ workspace }: WorkSpaceProps) {
  return (
    <button
      className="workspace"
      halign={Gtk.Align.FILL}
      child={
        <label
          xalign={0}
          label={bind(hyprland, 'focusedWorkspace').as(focused =>
            focused.id === workspace ? '' : ''
          )}
        />
      }
      onClicked={() => changeWorkspace(workspace)}
    />
  );
}

export type WorkspacesProps = {
  /**
   * Maximum number of workspaces to display
   * @default 5
   */
  numWorkspaces?: number;
};

/**
 * Displays current workspaces
 */
export default function Workspaces({
  numWorkspaces = 5,
}: WorkspacesProps = {}) {
  return (
    <box className="workspaces" spacing={8}>
      {_.range(1, numWorkspaces + 1).map(i => (
        <Workspace workspace={i} />
      ))}
    </box>
  );
}
