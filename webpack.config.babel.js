import path from 'path';
import webpack from 'webpack';

export default {
  entry: './app.js',
  devtool: 'source-map',
  output: {
    path: path.resolve('./public'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.json'],
    alias: {
      "jquery": path.join(__dirname, "./jquery-stub.js")
    }
  },
  plugins: [
    //
  ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js|.jsx?$/,
        use: [
          {loader: 'babel-loader'}
        ]
      },
      {
        test: /\.scss|.css?$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader', options: {
              includePaths: ['./node_modules']
            }
          },
          {
            loader: 'sass-loader', options: {
              includePaths: ['./node_modules']
            }
          }
        ]
      },
      {
        test: /\.jpg|.gif|.png?$/,
        use: [ 'file-loader' ]
      }
    ]
  },
  devServer: {
    port: 8080,
    host: "localhost",
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    watchOptions: {aggregateTimeout: 300, poll: 1000},
    contentBase: './public',
    open: true,
    proxy: {
      "/api/*": "http://127.0.0.1:5005"
    }
  }
};