const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const ManifestVersionSyncPlugin = require('webpack-manifest-version-sync-plugin');
const Dotenv = require('dotenv-webpack');

require('dotenv').config();

module.exports = {
  // target: 'node',
  entry: {
    popup: './src/popup.js',
    content: './src/content.js',
    background: './src/background.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      chunks: ['popup'],
      filename: 'popup.html',
    }),
    new CopyPlugin([
      { from: './src/_locales/', to: './_locales' },
      { from: './src/assets', to: './assets' },
      {
        from: './src/manifest.json',
        transform(content) {
          return content
            .toString()
            .replace(
              /process\.env\.fetch_supported_movies/g,
              process.env.fetch_supported_movies,
            )
            .replace(
              /process\.env\.fetch_movie/g,
              process.env.fetch_movie,
            );
        },
        to: './manifest.json'
      }
    ]),
    new ExtensionReloader({
      manifest: path.resolve(__dirname, './src/manifest.json'),
    }),
    new ManifestVersionSyncPlugin(),
    new Dotenv(),
  ],
  optimization: {
    minimize: true,
  },
  mode: 'production',
  stats: 'minimal',
};
