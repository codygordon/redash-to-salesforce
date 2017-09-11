const path = require('path');
const Dotenv = require('dotenv-webpack');
const UglifyJS = require('uglifyjs-webpack-plugin');
const CleanWebpack = require('clean-webpack-plugin');

module.exports = {
  entry: './lib/index.js',
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpack(['dist']),
    new Dotenv({
      path: '.env',
      safe: true,
    }),
    new UglifyJS(),
  ],
};
