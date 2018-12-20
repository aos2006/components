const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// External components that should be included in main bundle (not vendor), usually frequently updated
const vendorUpdating = ['@latoken-component', 'runtime'];
const threads = Math.max(Math.min(require('os').cpus().length - 2, 4), 1);

module.exports = merge(common, {
  entry: [path.resolve('src/index.js')],
  plugins: [
    new UglifyJSPlugin({
      parallel: true,
      uglifyOptions: {
        // compress: {
        //   drop_console: true,
        // },
        output: {
          comments: false,
          beautify: false,
          ascii_only: true,
        },
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
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
    new ExtractTextPlugin({
      filename: 'static/css/[name]-[contenthash:8].css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor-static',
      filename: 'static/js/[name]-[chunkhash].js',
      minChunks(module, count) {
        const context = module.context;

        if (context && context.indexOf('node_modules') !== -1) {
          for (let i = 0; i < vendorUpdating.length; i++) {
            if (context.indexOf(vendorUpdating[i]) !== -1) {
              return false;
            }
          }

          return true;
        }

        return false;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      filename: 'static/js/[name]-[chunkhash].js',
    }),
    // new CopyWebpackPlugin([{ from: 'prod_statics', to: 'prod_statics' }]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: { minimize: true },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
            },
          ],
        }),
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: { minimize: true },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'less-loader', // compiles Less to CSS
            },
          ],
        }),
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          use: [
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
                  path.resolve(
                    __dirname,
                    '../node_modules/@latoken-component/utils/constants.styl'
                  ),
                ],
              },
            },
          ],
        }),
      },
    ],
  },
});
