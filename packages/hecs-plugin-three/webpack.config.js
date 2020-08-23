const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = env => {
  const config = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'hecs-plugin-three.js',
      library: {
        root: 'HecsPluginThree',
        amd: 'hecs-plugin-three',
        commonjs: 'hecs-plugin-three',
      },
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    devtool: 'source-map',
    node: { fs: 'empty' },
    plugins: [new CleanWebpackPlugin()],
    externals: [
      {
        hecs: {
          root: 'HECS',
          amd: 'hecs',
          commonjs: 'hecs',
          commonjs2: 'hecs',
        },
        'hecs-plugin-core': {
          root: 'HecsPluginCore',
          amd: 'hecs-plugin-core',
          commonjs: 'hecs-plugin-core',
          commonjs2: 'hecs-plugin-core',
        },
        three: {
          root: 'THREE',
          amd: 'three',
          commonjs: 'three',
          commonjs2: 'three',
        },
      },
      /^three\/examples/,
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  }
  if (isProduction) {
    config.mode = 'production'
    config.devtool = false
  }
  return config
}
