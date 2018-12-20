const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const paths = {
  appBuild: path.resolve(__dirname, '../build'),
  appPublic: path.resolve(__dirname, '../public'),
  appSrc: path.resolve(__dirname, '../src'),
  appStatics: path.resolve(__dirname, '../statics'),
  get appHtml() {
    return path.resolve(this.appPublic, 'index.html');
  },
};

function notLatokenComponent(modulePath) {
  return (
    modulePath.indexOf('@latoken-component') === -1 && modulePath.indexOf('node_modules') !== -1
  );
}

function isLatokenIcon(modulePath) {
  return modulePath.indexOf('@latoken-component') !== -1 && modulePath.indexOf('icons') !== -1;
}
const isProduction = process.NODE_ENV === 'production';

console.log(isProduction);

module.exports = {
  output: {
    path: paths.appBuild,
    filename: isProduction ? 'static/js/bundle-[chunkhash].js' : 'static/js/bundle.js',
    chunkFilename: isProduction
      ? 'static/js/chunk-[name]-[chunkhash].js'
      : 'static/js/chunk-[name].js',
    publicPath: '/',
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    modules: [paths.appSrc, 'node_modules'],
    alias: {
      statics: paths.appStatics,
      modules: path.resolve(__dirname, '../src/modules'),
      components: path.resolve(__dirname, '../src/components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: notLatokenComponent,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: notLatokenComponent,
        use: {
          loader: 'ts-loader?transpileOnly=true',
        },
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf|gif|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[ext]',
            },
          },
        ],
        exclude: isLatokenIcon,
      },
      {
        test: /\.svg$/,
        use: `svg-inline-loader`,
        include: isLatokenIcon,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env.CDN_URL': JSON.stringify(process.env.CDN_URL || ''),
      'process.env.LOCIZE_API_KEY': JSON.stringify(process.env.LOCIZE_API_KEY || ''),
      'process.env.LOCIZE_PROJECT_ID': JSON.stringify(process.env.LOCIZE_PROJECT_ID || ''),
      'process.env.LOCIZE': JSON.stringify(process.env.LOCIZE || false),
      'process.env.SEGMENT_ID': JSON.stringify(process.env.SEGMENT_ID || false),
      'process.env.EM_HOST': JSON.stringify(process.env.EM_HOST || false),
      metricsUrl: JSON.stringify(process.env.METRICS_URL || false),
      wsUrl: JSON.stringify(process.env.WS_URL || false),
      API_URL: JSON.stringify(process.env.API_URL || false),
      isInsideLibrary: JSON.stringify(false),
      isInsideStatic: JSON.stringify(true),
      isInsideWallet: JSON.stringify(false),
      isTest: JSON.stringify(false),
      IS_REGRESS_TEST: JSON.stringify(process.env.IS_REGRESS_TEST || false),
      // PUBLIC_URL: publicUrl,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      memoryLimit: 3000,
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
