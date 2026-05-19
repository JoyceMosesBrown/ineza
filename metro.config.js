const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Alias react-native-svg to web-compatible version on web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-svg') {
    return context.resolveRequest(context, 'react-native-svg-web', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
