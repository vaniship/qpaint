const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const proConfig = require('./webpack.pro.config')

const config = process.NODE_ENV === 'development' ? devConfig : proConfig

module.exports = merge(baseConfig, config)
