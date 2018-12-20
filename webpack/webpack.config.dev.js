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

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';
const {
  PORT,
  PORT_OVERRIDE,
  HOSTNAME,
  API_PORT,
  API_PORT_OVERRIDE,
  API_HOSTNAME,
  API_HOSTNAME_OVERRIDE,
} = process.env;

const params = {
  port: PORT_OVERRIDE || PORT,
  hostname: HOSTNAME,
  // hostname: HOSTNAME_OVERRIDE || HOSTNAME,
  apiPort: API_PORT_OVERRIDE || API_PORT,
  apiHostname: API_HOSTNAME_OVERRIDE || API_HOSTNAME,
};
// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const stylRegex = /\.(styl)$/;
const lessRegex = /\.(less)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const antdStylRegex = /\.antd\.styl$/;

// common function to get style loaders
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

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  stats: {
    builtAt: true,
  },
  mode: 'development',
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebook/create-react-app/issues/343
  devtool: 'source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  entry: {
    client: [path.resolve('./src/index.js')],
  },
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: false,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/[name].js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'static/js/[name].chunk.js',
    // This is the URL that app is served from. We use "/" in development
    publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
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
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebook/create-react-app/issues/253
    modules: ['node_modules'].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebook/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
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
      modules: paths.appModules,
      components: paths.appComponents,
      constants: paths.constants,
      utils: paths.appUtils,
      src: paths.appSrc,
      store: paths.appStores,
    },
    plugins: [
      // Adds support for installing with Plug'n'Play, leading to faster installs and adding
      // guards against forgotten dependencies and such.
      PnpWebpackPlugin,
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  resolveLoader: {
    plugins: [
      // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
      // from the current package.
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
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
            include: isLatokenIcon,
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
            test: [/\.(j|t)sx?$/, /\.(j|t)s?$/],
            // exclude: /node_modules/,
            include: [paths.appSrc, /@latoken/],
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
            test: /\.svg$/,
            use: `svg-inline-loader`,
            include: isLatokenIcon,
          },
          // Process application JS with Babel.
          // The preset includes JSX, Flow, and some ESnext features.
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
                options: {
                  import: [
                    path.resolve(
                      __dirname,
                      '../node_modules/@latoken-component/utils/constants.styl'
                    ),
                  ],
                },
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
                options: {
                  import: [
                    path.resolve(
                      __dirname,
                      '../node_modules/@latoken-component/utils/constants.styl'
                    ),
                  ],
                },
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
            exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/],
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
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // This gives some necessary context to module not found errors, such as
    // the requesting resource.
    new ModuleNotFoundPlugin(paths.appPath),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(
      Object.assign({}, env.stringified, {
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
      })
    ),
    // This is necessary to emit hot updates (currently CSS only):
    // new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebook/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebook/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath,
    }),
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // Turn off performance processing because we utilize
  // our own hints via the FileSizeReporter
  performance: false,
  devServer: {
    host: '0.0.0.0',
    port: params.port,
    stats: 'minimal',
    inline: true,
    compress: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
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
};
