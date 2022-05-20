import typescript from '@rollup/plugin-typescript';
import node from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/extension/index.js',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    commonjs(),
    node({
      preferBuiltins: true,
    }),
    json(),
    terser(),
  ],
  external: [
    'vscode',
    'stream/web',
    'util/types',
    'miniprogram-ci',
  ],
};
