module.exports = {
  // Perform customizations to webpack dev middleware config -Important: return the modified config
  webpackDevMiddleware: (config) => {
    // watches for file-change detection
    config.watchOptions.poll = 300;
    return config;
  },
};
