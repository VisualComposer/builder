var CollectElementSettingsModule = require('./CollectElementsSettings');
module.exports = {
	context: __dirname + "/public",
	entry: './main',
	output: {
		path:  __dirname + '/dist',
		filename: 'bundle.js'
	},
	plugins: [
			new CollectElementSettingsModule()
	],
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader' },
			{ test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
		]
	},
	debug: true
};