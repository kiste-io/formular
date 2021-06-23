const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const extpath = path.join(__dirname, '../src/extension/');


module.exports = {
  entry:  {
    background: [ `${extpath}background` ],
    panel: [ `${extpath}panel` ],
    devtools: [ `${extpath}devtools` ],
    content_script: [ `${extpath}content_script` ],
  },
  output: {
    path: path.join(__dirname, '../build') ,
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
        name: "vendor",
        chunks: "initial",
    },
  },
  plugins: [
    new CopyPlugin({
        patterns: [ 
          { from: "./", to: "./", context: "public" }
        ],
        options: {},
    }),
  ],
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
}
