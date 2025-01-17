import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/gpu-canvas.js',
    format: 'es',
    sourcemap: true,
	inlineDynamicImports: true,
    plugins: [
      production && terser()
    ].filter(Boolean)
  },
  plugins: [
	resolve(),
	commonjs(),
    typescript()
  ],
}
