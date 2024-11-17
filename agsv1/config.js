const entry = `${App.configDir}/src/main.ts`;
const out = `${App.configDir}/dist/main.js`;

let startTime = Date.now();

Utils.execAsync(`rm -f ${App.configDir}/dist/*.js`)
  .then(() =>
    Utils.execAsync([
      'esbuild',
      '--bundle',
      '--minify',
      '--splitting',
      entry,
      '--tree-shaking=true',
      '--format=esm',
      `--outdir=${App.configDir}/dist`,
      '--external:resource://*',
      '--external:gi://*',
      '--external:file://*',
    ]))
  .then(() => {
    console.log(`Build time: ${Date.now() - startTime}ms`);
    startTime = Date.now();
    return import(`file://${out}`);
  })
  .then(() => {
    console.log(`Import time: ${Date.now() - startTime}ms`);
  })
  .catch((e) => {
    console.log(e);
    App.quit();
  });