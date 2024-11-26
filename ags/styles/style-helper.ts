import { bash } from '@/utils/utils';
import { writeFileAsync } from 'astal/file';
import { App } from 'astal/gtk3';

//Output paths
const variablesPath = `./dist/variables.scss`;
const scssPath = `./dist/main.scss`;
const finalCssPath = `./dist/main.css`;

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
  App.apply_css(finalCssPath, true);
} catch (e) {
  await resetCss();
}

export async function resetCss() {
  try {
    const [fd, walPath, distVariablesPath] = await Promise.all([
      bash(`fd ".scss" ~/.config/ags/styles`),
      bash('echo $HOME/.cache/wal/colors.scss'),
      bash('echo $HOME/.config/ags/dist/variables.scss'),
    ]);
    const files = fd.split(/\s+/);
    const imports = [walPath, distVariablesPath, ...files].map(
      f => `@import "${f}";`
    );

    await writeFileAsync(variablesPath, variables.join('\n'));
    await writeFileAsync(scssPath, imports.join('\n'));
    await bash(`sass ${scssPath} ${finalCssPath}`);
    App.apply_css(finalCssPath, true);
  } catch (e) {
    console.error(e);
  }
}
