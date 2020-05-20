const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

module.exports = {
	entry: {
		main: './src/main.ts'
	},
	output: {
		path: path.resolve(__dirname, '.build'),
		filename: '[name].js',
		chunkFilename: '[id].js'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
		plugins: [
			PnpWebpackPlugin,
		],
		alias: {
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@interfaces": path.resolve(__dirname, "./src/interfaces"),
			"@data": path.resolve(__dirname, "./src/data"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@modules": path.resolve(__dirname, "./src/modules"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@view": path.resolve(__dirname, "./src/view"),
		}
	},
	resolveLoader: {
		plugins: [
			PnpWebpackPlugin.moduleLoader(module),
		],
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						configFile: path.resolve(__dirname, 'babel.config.json')
					}
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Secure Book'
		})
	],
	devtool: 'inline-source-map',
	devServer: {
		hot: true,
		port: 8080
	}
};