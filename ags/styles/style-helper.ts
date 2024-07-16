import { bash } from '@/utils/utils';

const cwd = App.configDir; // ~/.config/ags

//Output paths
const variablesPath = `${cwd}/dist/variables.scss`;
const scssPath = `${cwd}/dist/main.scss`;
const finalCssPath = `${cwd}/dist/main.css`;

const $ = (name: string, value: string) => `$${name}: ${value};`;
const variables = [
  $('white', '#fff'),
  $('black', '#000'),
  // Wal values to human readable
  $('bg', 'transparentize($background, 0.05)'),
  $('widget-bg', 'transparentize(lighten($bg, 10%), 0.5)'),
  $('fg', '$foreground'),
  $('primary', '$color6'),
  $('not-so-disabled', 'transparentize($fg, 0.5)'),
  $('disabled', 'transparentize($fg, 0.75)'),
];

// Inital application of css
// If it fails, reset css (Build it again)
try {
  App.applyCss(finalCssPath, true);
} catch (e) {
  await resetCss();
}

export async function resetCss() {
  try {
    const fd = await bash(`fd ".scss" ${App.configDir}/styles`);
    const walPath = await bash('echo $HOME/.cache/wal/colors.scss');
    const files = fd.split(/\s+/);
    const imports = [walPath, variablesPath, ...files].map(
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
