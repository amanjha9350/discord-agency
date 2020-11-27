/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { dest, buildPath, MODE } = require('./paths');

const conf = {
	entry: {
		script: path.resolve(__dirname, '../src/js/index.js')
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, `./${dest}`),
		publicPath: `${buildPath}/`,
		chunkFilename: '[name].bundle.js'
	},
	devServer: {
		overlay: true,
		historyApiFallback: true
	},
	module: {
		rules: [
			{
				test: /\.(js|mjs|jsx)$/,
				enforce: 'pre',
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'env',
								{
									targets: {
										chrome: '58',
										ie: '10'
									},
									loose: false,
									modules: false,
									useBuiltIns: 'entry'
								}
							],
							'stage-2'
						]
					}
				}
			}
		]
	},
	mode: 'production',
	optimization: {
		minimize: true,
		minimizer: [new UglifyJsPlugin()],
		usedExports: false,
		sideEffects: false
	},
	watch: MODE === 'development'
};

module.exports = () => {
	conf.devtool = 'source-map';
	return conf;
};
