const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const MinifyPlugin = require('babel-minify-webpack-plugin')

// Main const. Feel free to change it
const PATHS = {
  src: path.resolve(__dirname, '../src'),
  views: path.resolve(__dirname, '../src/views'),
  dist: path.resolve(__dirname, '../dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/views`
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith('.html'))

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: {
    app: ['@babel/polyfill', PATHS.src],
  },
  output: {
    filename: `${PATHS.assets}js/[name].[contenthash].js`,
    path: PATHS.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.scss'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@scss': path.resolve(__dirname, '../src/assets/scss'),
      '@js': path.resolve(__dirname, '../src/assets/js'),
      '@images': path.resolve(__dirname, '../src/assets/images'),
      '@fonts': path.resolve(__dirname, '../src/assets/fonts'),
    }
  },
  module: {
    rules: [

      {
        test: /\.(css|s[ac]ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: [
            {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env']
              }
            },
          'source-map-loader'
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].css`,
    }),
    new MinifyPlugin(true),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/${PATHS.assets}images`,
          to: `${PATHS.assets}images`,
          noErrorOnMissing: true
        },
        {
          from: `${PATHS.src}/${PATHS.assets}fonts`,
          to: `${PATHS.assets}fonts`,
          noErrorOnMissing: true
        },
      ]
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page}`,
          minify: {
            collapseWhitespace: true,
          }
        })
    ),
  ],
}