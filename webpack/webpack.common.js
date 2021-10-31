// shared webpack config object for dev, build, prod, demo...

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');

const isProd = process.env.NODE_ENV === 'production';
// console.log(';;isProd-sass, ', isProd);

module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        // test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProd
            ? MiniCssExtractPlugin.loader
            : {
                loader: 'style-loader',
                options: {
                  injectType: 'singletonStyleTag',
                  attributes: {
                    'data-cke': true,
                  },
                },
              },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                },
                minify: true,
              }),
            },
          },
          // {
          //   loader: 'sass-loader',
          //   options: {
          //     // when node-sass and sass were installed，by default sass-loader prefers sass.
          //     implementation: require('sass'),
          //     sassOptions: {
          //       // fiber: require('fibers'),
          //     },
          //   },
          // },
        ],
      },
      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[hash].[ext]',
            },
          },
        ],
      },
      // Files
      {
        // test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        test: /\.(jpg|jpeg|png|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'staticI/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre',
      },
      // {
      //   loader: require.resolve('file-loader'),
      //   // Exclude `js` files to keep the "css" loader working as it injects
      //   // its runtime that would otherwise be processed through the "file" loader.
      //   // Also exclude `html` and `json` extensions so they get processed
      //   // by webpack's internal loaders.
      //   exclude: [
      //     /\.(js|mjs|jsx|ts|tsx)$/,
      //     /\.html$/,
      //     /\.json$/,
      //     /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
      //     /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/
      //   ],
      //   options: {
      //     name: 'static/media/[name].[hash:8].[ext]',
      //   }
      // }
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // alias: {},
  },
  // experiments: {
  //   topLevelAwait: true,
  // },
  // ignoreWarnings: [/Failed to parse source map/],
};
