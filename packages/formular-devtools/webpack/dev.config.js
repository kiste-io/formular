const {merge} = require('webpack-merge');
const common = require('./base.config');
var path = require('path');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        hot: true
      },
});

