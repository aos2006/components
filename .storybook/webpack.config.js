// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
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
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: true,
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    alias: {
      components: path.resolve(__dirname, '../src/components'),
    },
  },
  mode: 'development',
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebook/create-react-app/issues/343
  devtool: 'source-map',
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: false,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    // There are also additional JS chunk files if you use code splitting.
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    removeAvailableModules: false,
    removeEmptyChunks: false,
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  plugins: [
    new CheckerPlugin(),
    new TSDocgenPlugin(),
    new ModuleNotFoundPlugin(paths.appPath),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
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
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: 'awesome-typescript-loader',
                options: {
                  useCache: true,
                  useBabel: true,
                  babelOptions: {
                    babelrc: false /* Important line */,
                    presets: [
                      ['@babel/preset-env', { targets: 'last 2 versions, ie 11', modules: false }],
                    ],
                    plugins: [
                      '@babel/plugin-transform-runtime',
                      '@babel/plugin-syntax-dynamic-import',
                      'react-hot-loader/babel',
                    ],
                  },

                  babelCore: '@babel/core',
                  forceIsolatedModules: true,
                  transpileOnly: true,
                },
              },
              'react-docgen-typescript-loader',
            ],
          },
          {
            test: [/\.jsx?$/, /\.js?$/],
            exclude: /node_modules/,
            include: [paths.appSrc],
            use: {
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
          },
          {
            test: /\.(js|mjs|jsx)$/,
            include: paths.appSrc,
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
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              // Don't waste time on Gzipping the cache
              cacheCompression: false,
            },
          },
          {
            test: /\.svg$/,
            use: `svg-inline-loader`,
          },
          // Process application JS with Babel.
          // The preset includes JSX, Flow, and some ESnext features.,
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
              // Don't waste time on Gzipping the cache
              cacheCompression: false,

              // If an error happens in a package, it's possible to be
              // because it was compiled. Thus, we don't want the browser
              // debugger to show the original code. Instead, the code
              // being evaluated would be muchmore helpful.
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
          // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
          // using the extension .module.css
          // Opt-in support for SASS (using .scss or .sass extensions).
          // Chains the sass-loader with the css-loader and the style-loader
          // to immediately apply all styles to the DOM.
          // By default we support SASS Modules with the
          // extensions .module.scss or .module.sass
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, 'sass-loader'),
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
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
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.ejs$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
};
