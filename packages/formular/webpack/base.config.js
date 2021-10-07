const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const extpath = path.join(__dirname, '../src/');


module.exports = {
  entry:  {
    index: [ `${extpath}index` ]
  },
  output: {
    path: path.join(__dirname, '../build'),
    libraryTarget: 'umd',
    filename: '[name].js',
    globalObject: 'this'
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },  
  externals: {
    'react': 'react'
  }
}
