import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import styles from "rollup-plugin-styles";
import { terser } from 'rollup-plugin-terser';


export default {
  input: 'src/main.ts',
  output: [
    // {
    //   file: 'dist/flipper.cjs.js',
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
  plugins: [
    typescript(),
    json(),
    styles(),
  ]
};
