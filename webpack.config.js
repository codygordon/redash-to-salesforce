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
        //include: [path.resolve(__dirname, './lib')],
        //exclude: /node_modules/,
        exclude: [
            /node_modules\/babel-/m,
            /node_modules\/core-js\//m,
            /node_modules\/regenerator-/m
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'es2017', 'stage-2'],
          plugins: ["transform-runtime"]
        },
      },
    ],
  },
  plugins: (
    process.env.NO_ENV_CHANGE
      ? [ new CleanWebpack(['dist'])]
      : [ new CleanWebpack(['dist']),
          new Dotenv({
            path: '.env',
            safe: true,
          }),
          new UglifyJS(),
          new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
          }) ]),
};
