const webpack = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    },
  };

  on('file:preprocessor', webpack(options));
  return config;
};
