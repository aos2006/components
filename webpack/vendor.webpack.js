const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['react', 'mobx', 'mobx-react', 'lodash', 'react-dom', 'classnames', 'antd'],
  },
  output: {
    path: path.join(__dirname, './dll'),
    filename: 'dll.[name].js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]',
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
    }),
  ],
  resolve: {
    modules: ['node_modules'],
  },
};
