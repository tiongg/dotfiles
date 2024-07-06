import { bash } from 'utils/utils';

const cwd = App.configDir; // ~/.config/ags

//Output paths
const variablesPath = `${cwd}/dist/variables.scss`;
const scssPath = `${cwd}/dist/main.scss`;
const finalCssPath = `${cwd}/dist/main.css`;

const $ = (name: string, value: string) => `$${name}: ${value};`;
const variables = [$('white', '#fff'), $('black', '#000')];

export async function resetCss() {
  try {
    const fd = await bash(`fd ".scss" ${App.configDir}/styles`);
    const walPath = await bash('echo $HOME/.cache/wal/colors.scss');
    const files = fd.split(/\s+/);
    const imports = [variablesPath, walPath, ...files].map(
      (f) => `@import "${f}";`
    );

    await Utils.writeFile(variables.join('\n'), variablesPath);
    await Utils.writeFile(imports.join('\n'), scssPath);
    await bash(`sass ${scssPath} ${finalCssPath}`);

    App.applyCss(finalCssPath, true);
  } catch (e) {
    console.error(e);
  }
}
