/**
 * Generates the path to the icon.
 * @param icon - Icon name without extension
 * @param extension - Icon extension. Defaults to svg
 * @returns
 */
export default function iconPath(icon: string, extension: string = 'svg') {
  return `${App.configDir}/src/icons/${icon}.${extension}`;
}
