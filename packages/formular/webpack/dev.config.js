const {merge} = require('webpack-merge');
const common = require('./base.config');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development'
});
