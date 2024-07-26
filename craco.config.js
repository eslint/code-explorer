const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');
module.exports = {
  webpack: {
    plugins: {
      add: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
          },
        }),
      ],
    },
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "assert": require.resolve("assert/"),
      };

      return webpackConfig;
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};