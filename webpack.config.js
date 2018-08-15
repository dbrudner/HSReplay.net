"use strict";

const path = require("path");
const webpack = require("webpack");
const BundleTracker = require("webpack-bundle-tracker");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// TODO: unhardcode me
const exportedSettings = {
	STATIC_URL: "/static/",
	JOUST_STATIC_URL: "https://joust.hearthsim.net/branches/master/",
	SUNWELL_URL: "https://sunwell.hearthsim.net/branches/master/",
	HEARTHSTONE_ART_URL: "https://art.hearthstonejson.com/v1",
	JOUST_RAVEN_DSN_PUBLIC: process.env.JOUST_RAVEN_DSN_PUBLIC,
	JOUST_RAVEN_ENVIRONMENT: process.env.NODE_ENV,
	INFLUX_DATABASE_JOUST: process.env.INFLUX_DATABASE_JOUST,
	SITE_EMAIL: "contact@hsreplay.net",
};
const settings = {};
for (const [key, val] of Object.entries(exportedSettings)) {
	settings[key] = JSON.stringify(val);
}
const isProduction = process.env.NODE_ENV === "production";

const plugins = [];
if (isProduction) {
	const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
	plugins.push(
		new UglifyJSPlugin({
			parallel: true,
			sourceMap: true,
		}),
	);
} else {
	const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
	plugins.push(new HardSourceWebpackPlugin({}));
}

module.exports = env => {
	env = env || {};

	// define entry points and groups with common code
	const makeEntry = name =>
		path.join(__dirname, "hsreplaynet/static/scripts/src/entries/", name);
	const entries = {
		account_api: makeEntry("account_api"),
		account_billing: makeEntry("account_billing"),
		account_connections: makeEntry("account_connections"),
		account_delete: makeEntry("account_delete"),
		account_edit: makeEntry("account_edit"),
		downloads: makeEntry("downloads"),
		my_replays: makeEntry("my_replays"),
		redeem_code: makeEntry("redeem_code"),
		replay_detail: makeEntry("replay_detail"),
		replay_embed: makeEntry("replay_embed"),
		stats: {
			archetype_detail: makeEntry("archetype_detail"),
			card_detail: makeEntry("card_detail"),
			cards: makeEntry("cards"),
			deck_detail: makeEntry("deck_detail"),
			decks: makeEntry("decks"),
			my_cards: makeEntry("my_cards"),
			my_decks: makeEntry("my_decks"),
			meta_overview: makeEntry("meta_overview"),
			trending: makeEntry("trending"),
		},
		my_packs: makeEntry("my_packs"),
		premium_detail: makeEntry("premium_detail"),
		discover: makeEntry("discover"),
		card_editor: makeEntry("card_editor"),
		home: makeEntry("home"),
		upload_processing: makeEntry("upload_processing"),
		vendor: [
			"babel-polyfill",
			"whatwg-fetch",
			makeEntry("export-react"),
			makeEntry("polyfills"),
		],
		site: makeEntry("site"),
	};

	// flatten the entry points for config
	const entriesFlat = {};
	const groups = [];
	for (const group in entries) {
		const values = entries[group];
		if (typeof values === "string" || Array.isArray(values)) {
			entriesFlat[group] = values;
		} else if (typeof values === "object") {
			groups.push(group);
			for (const key in values) {
				entriesFlat[key] = values[key];
			}
		}
	}

	// define a CommonsChunkPlugin for each group
	const commons = groups.map(
		group =>
			new webpack.optimize.CommonsChunkPlugin({
				names: group,
				chunks: Object.keys(entries[group]),
				minChunks: 3,
			}),
	);

	entriesFlat["main"] = path.join(
		__dirname,
		"hsreplaynet/static/styles",
		"main.scss",
	);
	const extractSCSS = new ExtractTextPlugin(
		isProduction ? "[name].[contenthash].css" : "[name].css",
	);

	return {
		context: __dirname,
		entry: entriesFlat,
		output: {
			filename: isProduction ? "[name].[chunkhash].js" : "[name].js",
			sourceMapFilename: "[file].map",
			path: path.join(__dirname, "build", "generated", "webpack"),
			publicPath: isProduction
				? exportedSettings.STATIC_URL + "webpack/"
				: "http://localhost:3000/",
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js"],
			alias: {
				// we need to this to get the fully bundled d3, instead of the independent module
				d3: "d3/build/d3.js",
				i18n: path.resolve(__dirname, "locale"),
			},
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "babel-loader",
							options: {
								presets: [
									"react",
									[
										"env",
										{
											targets: {
												browsers: [
													"ie >= 11",
													"last 2 chrome versions",
													"last 2 firefox versions",
													"last 2 edge versions",
													"safari >= 9",
												],
											},
											modules: false,
										},
									],
								],
								plugins: [
									"syntax-dynamic-import",
									"transform-object-rest-spread",
								],
								cacheDirectory: true,
							},
						},
						{
							loader: "ts-loader",
							options: {
								silent: true,
							},
						},
					],
				},
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: extractSCSS.extract([
						{
							loader: "css-loader",
							options: {
								minimize: true,
								sourceMap: true,
							},
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: true,
							},
						},
					]),
				},
			],
		},
		externals: {
			jquery: "jQuery",
			joust: "Joust",
			sunwell: "Sunwell",
		},
		plugins: [
			new BundleTracker({
				path: __dirname,
				filename: "./build/webpack-stats.json",
			}),
			new webpack.DefinePlugin(settings),
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify(
						isProduction ? "production" : "development",
					),
				},
			}),
			extractSCSS,
			new webpack.optimize.CommonsChunkPlugin({
				name: "vendor",
				minChunks: module => /node_modules/.test(module.resource),
			}),
		]
			.concat(commons)
			.concat(plugins),
		watchOptions: {
			// required in the Vagrant setup due to Vagrant inotify not working
			poll: 1000,
		},
		devtool: isProduction ? "source-map" : "cheap-module-eval-source-map",
		stats: {
			modules: false,
		},
		devServer: {
			host: "0.0.0.0",
			port: 3000,
			publicPath: "http://localhost:3000/",
			overlay: true,
		},
	};
};
