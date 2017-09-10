const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './lib/index.js',
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv({
      path: '.env',
      safe: true,
    }),
  ],
};
