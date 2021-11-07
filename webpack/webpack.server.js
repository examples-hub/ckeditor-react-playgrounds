// webpack config for dev demo using webpack-dev-server

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev');
const express = require('express');

module.exports = merge(devConfig, {
  devServer: {
    // 若要使用热加载，还需要在cli上传入 --hot
    // contentBase: path.resolve(__dirname, '../dist'),
    // open: true,
    host: '0.0.0.0',
    port: 8999,
    hot: true,
    compress: true,
    historyApiFallback: true,
    before: (app) => {
      app.use('/', express.static(path.resolve(__dirname, '../public')));
    },
  },
});
