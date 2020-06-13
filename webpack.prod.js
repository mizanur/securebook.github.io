const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
	mode: 'production',
	resolve: {
		alias: {
			"@configs": path.resolve(__dirname, "./.prod-configs"),
		},
	},
});