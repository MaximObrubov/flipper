import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.ts',
  output: [
    // {
    //   file: 'dist/bundle.js',
    //   sourcemap: true,
    //   format: 'cjs'
    // },
    {
      file: 'dist/flipper.min.js',
      format: 'iife',
      name: 'Flipper',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [typescript(), json()]
};
