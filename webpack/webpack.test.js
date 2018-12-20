const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HappyPack = require('happypack');
const threads = Math.max(Math.min(require('os').cpus().length - 2, 4), 1);

// Используем стратегию prepend для корректного поведения DefinePlugin
module.exports = merge.strategy({
  plugins: 'prepend',
})(common, {
  entry: [path.resolve('src/index.ts')],
  target: 'node',
  devtool: '#inline-cheap-module-source-map',
  plugins: [
    new HappyPack({
      id: 'js',
      loaders: ['babel-loader'],
      threads,
    }),
    new HappyPack({
      id: 'ts',
      threads,
      loaders: [
        {
          path: 'ts-loader',
          query: {
            happyPackMode: true,
            transpileOnly: true, // disable type checker - we will use it in fork plugin
          },
        },
      ],
    }),
    new webpack.DefinePlugin({
      isTest: JSON.stringify(true),
    }),
  ],
  externals: ['mobx'],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.styl$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader?modules&localIdentName=[local]___[hash:base64:4]',
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'stylus-loader',
            options: {
              import: [
                path.resolve(__dirname, '../node_modules/@latoken-component/utils/constants.styl'),
              ],
            },
          },
        ],
      },
    ],
  },
});
