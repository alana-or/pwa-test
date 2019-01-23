const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'app.bundle': ['./js/app.js'],
    'service_worker': ['./sv.js']
  },
  output: {
    filename: '[name].js'
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //       compress: {
  //         warnings: false,
  //       },
  //       output: {
  //         comments: false,
  //       },
  //       sourceMap: true
  //   }),
  // ],
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  watch: true,
  devtool: 'eval-source-map'
};