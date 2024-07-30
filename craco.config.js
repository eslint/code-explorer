const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        assert: require.resolve("assert/"),
      };

      webpackConfig.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
          },
        }),
      ];

      return webpackConfig;
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
