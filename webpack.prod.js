const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			'GITLAB_CONFIG': process.env.GITLAB_CONFIG
				? process.env.GITLAB_CONFIG
				: JSON.stringify(require('./.prod-configs/Gitlab'))
		}),
	]
});