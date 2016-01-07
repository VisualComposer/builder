var path = require('path');
var webpack = require('webpack');
var CollectElementSettingsModule = require('./CollectElementsSettings');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
	// context: path.resolve(__dirname, "public"),
	entry: {
		node: './public/main',
		wp: './public/wp-main'
	},
	output: {
		path: './public/dist/', // Assets dist path
		publicPath: '.', // Used to generate URL's
		filename: '[name].bundle.js', // Main bundle file
		chunkFilename: "[id].js"
	},
	plugins: [
			new CollectElementSettingsModule(),
			new ExtractTextPlugin("[name].bundle.css")
	],
	module: {
		loaders: [
			{ 	test: /\.js$/,
				loaders: ['react-hot', 'babel'],
				exclude: /node_modules/
			},
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
			{ test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") }, // use ! to chain loaders
			{ test: /\.(png|jpe?g|gif)$/, loader: 'url-loader?limit=10000&name=/images/[name].[ext]?[hash]' }, // inline base64 URLs for <=8k images, direct URLs for the rest
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=/fonts/[name].[ext]?[hash]" },
			// { test: require.resolve("react"), loader: "expose?React" },
			// **IMPORTANT** This is needed so that each bootstrap js file required by
			// bootstrap-webpack has access to the jQuery object
			{ test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' }
		]
	}
};