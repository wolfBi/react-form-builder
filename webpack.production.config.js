var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'react-form-builder': './src/index.jsx'
  },
  devtool: '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'ReactFormBuilder',
    libraryTarget: 'umd'
  },

  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'react',
    'react-dom': 'react-dom',
    // 'react-datepicker': 'react-datepicker',
    // 'classnames': 'classnames',
    'jquery': 'jquery',
    'bootstrap': 'bootstrap'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.json'],
    alias: {
      "jquery": path.join(__dirname, "./jquery-stub.js")
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
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
  }
};