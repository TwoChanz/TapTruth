// Metro config for the mobile app inside the pnpm monorepo.
//
// Critical: explicitly set `server.unstable_serverRoot` to apps/mobile.
// Metro's bundle URL handler (Server._processBundleRequest) resolves
// `./<entry>.bundle` relative to `server.unstable_serverRoot ?? projectRoot`.
// In monorepos, Expo CLI infers a "server root" further up the tree
// (where the workspace's package.json sits), which causes the bundle
// resolver to look for `./index` at the workspace root and fail.
// Pinning unstable_serverRoot here forces correct entry resolution.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.server = config.server ?? {};
config.server.unstable_serverRoot = __dirname;

console.log('[metro.config.js] projectRoot:', config.projectRoot);
console.log('[metro.config.js] server.unstable_serverRoot:', config.server.unstable_serverRoot);

module.exports = config;
