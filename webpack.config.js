const path = require('path');
const webpack = require('webpack');
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
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['stage-2'],
        },
      },
    ],
  },
  plugins: [
    new CleanWebpack(['dist']),
    new Dotenv({
      path: '.env',
      safe: true,
    }),
    new UglifyJS(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
