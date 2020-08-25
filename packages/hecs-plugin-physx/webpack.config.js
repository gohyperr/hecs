const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = env => {
  const config = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'hecs-plugin-physx.js',
      library: {
        root: 'HecsPluginPhysX',
        amd: 'hecs-plugin-physx',
        commonjs: 'hecs-plugin-physx',
      },
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    devtool: 'source-map',
    node: { fs: 'empty' },
    plugins: [new CleanWebpackPlugin()],
    externals: {
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
      'physx-js': {
        root: 'PHYSX',
        amd: 'physx-js',
        commonjs: 'physx-js',
        commonjs2: 'physx-js',
      },
    },
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
