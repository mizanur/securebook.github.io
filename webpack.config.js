const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
var WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
	entry: {
		'main': './src/main.ts',
	},
	output: {
		path: path.resolve(__dirname, '.build'),
		filename: '[name].js',
		chunkFilename: '[id].js',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
		plugins: [
			PnpWebpackPlugin,
		],
		alias: {
			"@editor": path.resolve(__dirname, "./src/editor"),
			"@errors": path.resolve(__dirname, "./src/errors"),
			"@assets": path.resolve(__dirname, "./assets"),
			"@configs": path.resolve(__dirname, "./src/configs"),
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
				test: /\.worker\.(js|jsx|ts|tsx)$/,
				use: { loader: 'worker-loader' }
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				use: ['file-loader'],
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
			title: 'Secure Book',
			favicon: './assets/original/favicon.ico',
		}),
		new WebpackPwaManifest({
			"name": "Secure Book",
			"short_name": "Secure Book",
			"description": "Write notes securely",
			"start_url": "/",
			"theme_color": "#A30316",
			"background_color": "#643C22",
			"display": "standalone",
			"icons": [
				{
					"src": "./assets/original/logo-192x192.png",
					"type": "image/png",
					"sizes": "192x192"
				},
				{
					"src": "./assets/original/logo-512x512.png",
					"type": "image/png",
					"sizes": "512x512"
				}
			]
		})
	],
	devtool: 'inline-source-map',
	devServer: {
		hot: true,
		port: 8080
	}
};