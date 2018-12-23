const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

console.log(appDirectory);
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


module.exports = {
  dotenv: resolveApp('../.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('../build'),
  appPublic: resolveApp('../public'),
  appHtml: resolveApp('public/index.html'),
  appModules: resolveApp('../src/modules'),
  appComponents: resolveApp('../src/components'),
  appIndexJs: resolveApp('../src/index.js'),
  appStores: resolveApp('../src/store'),
  appUtils: resolveApp('../src/utils'),
  constants: resolveApp('../src/constants.js'),
  appPackageJson: resolveApp('../package.json'),
  appSrc: resolveApp('../src'),
  yarnLockFile: resolveApp('../yarn.lock'),
  testsSetup: resolveApp('../src/setupTests.js'),
  proxySetup: resolveApp('../src/setupProxy.js'),
  appNodeModules: resolveApp('../node_modules'),
};
