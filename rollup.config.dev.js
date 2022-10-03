import config from "./rollup.config";
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  ...config,
  output: [
    {
      file: 'dist/flipper.js',
      format: 'iife',
      name: 'Flipper',
      sourcemap: true,
    }
  ],
  plugins: [
    ...config.plugins,
    serve(), // index.html should be in root of project
    livereload(),
  ]
}
