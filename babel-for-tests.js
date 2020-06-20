let config = require('./babel.config.json');

config = {
	...config,
	plugins: [
		...(config.plugins || []),
		["babel-plugin-webpack-alias-7", {"config": "./webpack.dev.js"}]
	]
};

require("@babel/register")({
	...config,
	babelrc: false,
	extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
});