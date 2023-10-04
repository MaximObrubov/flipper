import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';


export default {
  input: 'index.demo.html',
  output: { dir: 'demo' },
  plugins: [
    terser(),
    html()
  ],
};
