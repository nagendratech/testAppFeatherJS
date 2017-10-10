const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const AsyncAwaitPlugin = require('webpack-async-await')
const TapWebpackPlugin = require('tap-webpack-plugin')

const configs = []

const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

const node = /node_modules/

const folders = {
  root: path.resolve(__dirname),
  node_modules: path.resolve(__dirname, 'node_modules'),
  client_tests: path.resolve(__dirname, 'client-tests'),
  bundle: path.resolve(__dirname, 'public'),
  server: path.resolve(__dirname, 'server'),
  renderer: path.resolve(__dirname, 'vue-server-side-rendering.js'),
  serve: path.resolve(__dirname, 'public', '/'),
  app: path.resolve(__dirname, 'app'),
  styles: path.resolve(__dirname, 'app/styles.js')
}

const modules = {
  module : {
    preLoaders: [
      { 
        test: /\.json$/, 
        loader: 'json'
      },
    ],
    loaders : [
      // {
      //   test: /node_modules[\/\\]jsdom[\/\\]lib[\/\\]jsdom[\/\\]living[\/\\]generated[\/\\]MutationEvent\.js$/, 
      //   loader: "ignore-loader"
      // },
      {
        test: /mongoose/,
        loader: 'null'
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel?cacheDirectory',
      //   exclude: node,
      //   include: [
      //     folders.app,
      //     folders.renderer
      //   ]
      // },
      {
        test: /\.jade$/,
        loaders: ["string", "jade-html"],
        exclude: node,
        include: [
          folders.app,
          folders.renderer
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue',
        exclude: node,
        include: [
          folders.app,
          folders.renderer
        ]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass"),
        include: [
          folders.app,
          folders.renderer,
          // folders.node_modules
        ]
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract("style", "css!stylus"),
        exclude: node,
        include: [
          folders.app,
          folders.renderer
        ]
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      }
    ]
  },
  // noParse: [
  //   folders.node_modules
  // ],
  vue: {
    loaders: {
      // js: 'babel',
      css: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader"),
      stylus: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader"),
      html: 'jade'
    }
  },
  plugins: !isProduction ? [
    new AsyncAwaitPlugin({
      awaitAnywhere:true,
      asyncExits:true
    }),
    new ExtractTextPlugin("style.css")
  ] : [
    new AsyncAwaitPlugin({
      awaitAnywhere:true,
      asyncExits:true
    }),
    new ExtractTextPlugin("style.css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})
  ]
}

configs[0] = Object.assign({
  // entry: ['babel-polyfill', path.join(folders.app, 'app.js')],
  entry: [path.join(folders.app, 'app.js')],
  output: {
    path: path.join(folders.bundle, 'app'),
    pathinfo: true,
    filename: 'app.js',
    sourceMapFilename: "[file].map"
  },
  devtool: isProduction? null: "cheap-source-map",
  resolve: {
    modules: ['node_modules'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
}, modules);

// if(isProduction || isTest) {
  configs[1] = Object.assign({
    target: 'node',
    entry: ['babel-polyfill', path.join(folders.root, 'vue-server-side-rendering.js')],
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(folders.root, 'server'),
      filename: 'compiled-ssr.js'
    }
  }, modules)
// }


module.exports = configs
