import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export default {
  input: './src/index.js',//打包⽂件⼊⼝
  output: [
    {
      name: 'yeditor',
      file: './dist/yeditor.js',//指定打包后存放的⽂件路径
      format: 'umd', //打包⽂件输出格式，输⼊⽤require，输出⽤module.exports
      sourcemap: false,
    },
    {
      file: './dist/yeditor.es.js',//指定打包后存放的⽂件路径
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [ 
    commonjs(),
    resolve({
      module: true,
      jsnext: true,
      main: true
    }),
    babel({ babelHelpers: 'bundled' }),
    json()
  ]
 }