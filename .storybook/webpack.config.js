/* eslint-disable prettier/prettier */
const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const ManifestPlugin = require('webpack-manifest-plugin');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const antdTheme = require('./antd-config-theme.js');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const stylRegex = /\.(styl)$/;
const lessRegex = /\.(less)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const antdStylRegex = /\.antd\.styl$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: true,
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      },
    },
  ];

  if (preProcessor) {
    if (preProcessor && typeof preProcessor !== 'string') {
      loaders.push(preProcessor);
    } else {
      loaders.push(require.resolve(preProcessor));
    }
  }

  return loaders;
};

module.exports = {
  stats: {
    builtAt: true,
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    pathinfo: false,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: true,
  },
  resolve: {
    modules: ['node_modules'].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: [
      '.mjs',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
    alias: {
      components: path.resolve(__dirname, '../src/components'),
    },
    plugins: [
      PnpWebpackPlugin,
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.svg$/,
            use: `svg-inline-loader`,
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
          },
          {
            test: [/\.(j|t)sx?$/, /\.(j|t)s?$/],
            exclude: /node_modules/,
            include: path.resolve(__dirname, '../src'),
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                { useBuiltIns: false, targets: { browsers: 'last 2 versions' } }, // or whatever your project requires
                            ],
                            '@babel/preset-typescript',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
                            [
                                require.resolve('babel-plugin-named-asset-import'),
                                {
                                    loaderMap: {
                                        svg: {
                                            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                                        },
                                    },
                                },
                            ],
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            [
                                '@babel/plugin-proposal-class-properties',
                                {
                                    loose: true,
                                },
                            ],
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-syntax-dynamic-import',
                            'react-hot-loader/babel',
                        ],
                    },
                },
                'react-docgen-typescript-loader',
            ],

          },
          {
            test: /\.(js|mjs|jsx)$/,
            include: path.resolve(__dirname, '../src'),
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve('babel-preset-react-app/webpack-overrides'),

              plugins: [
                ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
                '@babel/plugin-syntax-dynamic-import',
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                      },
                    },
                  },
                ],
                'react-hot-loader/babel',
              ],
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [require.resolve('babel-preset-react-app/dependencies'), { helpers: true }],
              ],
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: false,
            },
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
            }),
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, 'sass-loader'),
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              'sass-loader'
            ),
          },
          {
            test: antdStylRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: false,
              },
              {
                loader: require.resolve('stylus-loader'),
              }
            ),
          },
          {
            test: stylRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              {
                loader: require.resolve('stylus-loader'),
              }
            ),
          },
          {
            test: lessRegex,
            use: getStyleLoaders(
              { importLoaders: 2, modules: false },
              {
                loader: require.resolve('less-loader'),
                options: {
                  modifyVars: {
                    ...antdTheme,
                  },
                  javascriptEnabled: true,
                },
              }
            ),
          },
          {
            exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/,  /\.ejs$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new ModuleNotFoundPlugin(paths.appPath),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/, /antd$/, /lodash$/, /node_modules$/),
  ],

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false,
};
