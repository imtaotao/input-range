const webpack = require('webpack');

module.exports = {
  entry: __dirname + "/example/index.ts",
  output: {
    path: __dirname,
    filename: "build.js",
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.tsx'],
  },
  devtool: 'source-map',
  devServer: {
      contentBase: __dirname,
      historyApiFallback: true,
      inline: true,
      hot: true,
      stats: "errors-only",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
    ],
  },
	plugins: [
    new webpack.BannerPlugin('input-range'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
	],
}
