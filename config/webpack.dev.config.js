// Development config:
const { SourceMapDevToolPlugin } = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: baseWebpackConfig.externals.paths.dist,
    },
    port: 9000,
  },
  plugins: [
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})