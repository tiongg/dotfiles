import { sh } from '@/utils/utils';
import _ from 'lodash';

const hyprland = await Service.import('hyprland');

function changeWorkspace(workspace: number) {
  sh(`hyprctl dispatch workspace ${workspace}`);
}

/**
 * Individual workspace
 */
function Workspace(workspace: number) {
  return Widget.Button({
    className: 'workspace',
    label: hyprland
      .bind('active')
      .as(() => (hyprland.active.workspace.id === workspace ? '' : '')),
    xalign: 0,
    onClicked: () => changeWorkspace(workspace),
  });
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
  return Widget.Box({
    className: 'workspaces',
    spacing: 8,
    children: _.range(1, numWorkspaces + 1).map((i) => Workspace(i)),
  });
}
