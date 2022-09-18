import config from "./rollup.config";

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
}
