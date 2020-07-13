const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = env => {
  const config = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'hyperfy-ecs.js',
      library: {
        root: 'HyperfyECS',
        amd: 'hyperfy-ecs',
        commonjs: 'hyperfy-ecs',
      },
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    devtool: 'source-map',
    node: { fs: 'empty' },
    plugins: [new CleanWebpackPlugin()],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    resolve: {
      // enables absolute imports, eg:-
      // import Transform from 'components/Transform'
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  }
  if (isProduction) {
    config.mode = 'production'
    config.devtool = false
  }
  return config
}
