const entry = `${App.configDir}/src/main.ts`;
const out = `${App.configDir}/dist/main.js`;

Utils.execAsync([
  'esbuild', '--bundle', entry,
  '--format=esm',
  `--outfile=${out}`,
  '--external:resource://*',
  '--external:gi://*',
  '--external:file://*',
])
  .then(() => {
    return import(`file://${out}`);
  })
  .catch((e) => {
    console.log(e);
    App.quit();
  });
