/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable n/no-unpublished-require */
const esbuild = require('esbuild');

async function main() {
  const context = await esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    format: 'cjs',
    minify: true,
    sourcemap: false,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension/index.js',
    external: ['vscode', 'miniprogram-ci'],
    logLevel: 'silent',
    plugins: []
  });

  await context.rebuild();
  await context.dispose();
}

main();