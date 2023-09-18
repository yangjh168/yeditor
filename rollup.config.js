import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export default {
  input:'./src/main.js',//打包⽂件⼊⼝
  output:{
    file:'./dist/bundle.js',//指定打包后存放的⽂件路径
    format:'cjs',//打包⽂件输出格式，输⼊⽤require，输出⽤module.exports
  },
  plugins: [ 
    commonjs(),
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    json()
  ]
 }