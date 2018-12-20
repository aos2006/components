const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const antdTheme = require('./antd-config-theme.js');

const {
  PORT,
  PORT_OVERRIDE,
  HOSTNAME,
  API_PORT,
  API_PORT_OVERRIDE,
  API_HOSTNAME,
  API_HOSTNAME_OVERRIDE,
  NODE_ENV,
} = process.env;

const isProduction = NODE_ENV === 'production';

const params = {
  port: PORT_OVERRIDE || PORT,
  hostname: HOSTNAME,
  apiPort: API_PORT_OVERRIDE || API_PORT,
  apiHostname: API_HOSTNAME_OVERRIDE || API_HOSTNAME,
};

// External components that should be included in main bundle (not vendor), usually frequently updated
const vendorUpdating = ['@latoken-component'];

const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new HardSourceWebpackPlugin({
    cacheDirectory: path.join(__dirname, 'node_modules/.cache/hardsource'),
    recordsPath: path.join(__dirname, 'node_modules/.cache/hardsource/records.json'),
  }),
  new webpack.DllReferencePlugin({
    context: './',
    name: '/static/js/dll.vendor.js',
    manifest: require(path.resolve(__dirname, './dll/vendor-manifest.json')),
  }),
  new ForkTsCheckerWebpackPlugin({}),
  new webpack.LoaderOptionsPlugin({
    options: {
      optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      },
    },
  }),

  // new BundleAnalyzerPlugin({
  //   // Can be `server`, `static` or `disabled`.
  //   // In `server` mode analyzer will start HTTP server to show bundle report.
  //   // In `static` mode single HTML file with bundle report will be generated.
  //   // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
  //   analyzerMode: 'server',
  //   analyzerHost: '127.0.0.1',
  //   analyzerPort: 8889,
  //   reportFilename: 'report.html',
  //   defaultSizes: 'parsed',
  //   openAnalyzer: false,
  //   generateStatsFile: false,
  //   statsFilename: 'stats.json',
  //   statsOptions: null,
  //   logLevel: 'silent',
  // }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor-static',
    filename: 'static/js/[name].js',
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
];

if (isProduction) {
  plugins.push(new UglifyJSPlugin());
}

module.exports = merge(common, {
  entry: ['webpack-hot-middleware/client', 'webpack-dev-middleware', path.resolve('src/index.js')],
  output: {
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/chunk-[name].js',
  },
  devtool: isProduction ? false : 'eval',
  plugins,
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
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
            options: {
              modifyVars: {
                ...antdTheme,
              },
            },
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
            options: {
              sourceMap: true,
            },
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
      {
        test: /\.(less)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'less-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: params.port,
    stats: 'minimal',
    inline: true,
    compress: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': `http://${params.hostname}:${params.port}`,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    },
    proxy: {
      '/socket.io': {
        target: `ws://${params.apiHostname}:${params.apiPort}`,
        ws: true,
      },
      '/v1/orders/getSvg': {
        secure: false,
        changeOrigin: true,
        target: `http://${params.apiHostname}:${params.apiPort}`,
      },
      '**': {
        secure: false,
        target: `http://${params.apiHostname}:${params.apiPort}`,
        bypass(req, res, proxyOptions) {
          const url = req.originalUrl;

          if (url === '/__webpack_hmr') {
            res.status(200);

            return res.write('ok');
          } else if (url.indexOf('/statics') !== -1 || url.indexOf('/prod_statics') !== -1) {
            return url;
          } else if (
            req.headers.hostname === params.hostname ||
            req.headers.accept.indexOf('text/html') !== -1
          ) {
            return '/index.html';
          } else if (url === '/favicon.ico') {
            return '/public/favicon.ico';
          } else if (url.indexOf('/file') !== -1 && url.indexOf('/thumbnail') !== -1) {
            const filename = url.substring(url.indexOf('/file') + 6, url.indexOf('/thumbnail'));

            return `/statics/img/logosDev/${filename}..png`;
          }
        },
      },
    },
  },
});
