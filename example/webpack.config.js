// Package
const pkg = require('./package.json');

// Vendor
const Webpack = require('webpack');
const AutoPrefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

// Paths
const path = require('path');

const distPath = path.resolve(__dirname, 'dist');
const publicPath = path.resolve(__dirname, 'public');
const srcPath = path.resolve(__dirname, 'src');

// Template
const attributes = {};
attributes.environment = process.env.NODE_ENV;
attributes.metadata = require('./metadata.json');
attributes.version = pkg.version;
attributes.branch = require('child_process').execSync('git name-rev --name-only HEAD').toString().trim();
attributes.revision = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
attributes.date = require('child_process').execSync('date +"%d-%m-%Y"').toString().trim();
attributes.time = require('child_process').execSync('date +"%T"').toString().trim();

// Environment
const isDevelopment = attributes.environment === 'development';

const config = {
	context: srcPath,
	devtool: isDevelopment ? 'eval-cheap-module-source-map' : '',
	entry: {
		// vendor: Object.keys(pkg.dependencies),
		app: './scripts/index',
	},
	output: {
		path: distPath,
		filename: './scripts/bundle-[hash].js',
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				include: srcPath,
				exclude: /node_modules\/(?!(webgl-constants)\/).*/,
				loader: 'babel-loader?cacheDirectory=true',
				options: {
					presets: [
						['env', {
							targets: {
								browsers: ['last 2 versions'],
							},
							modules: false,
						}],
					],
				},
			},
			{
				test: /\.(glsl|frag|vert)$/,
				include: srcPath,
				use: 'raw-loader',
			},
			{
				test: /\.scss$/,
				include: srcPath,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: isDevelopment,
								minimize: !isDevelopment,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: isDevelopment,
								plugins: () => [
									AutoPrefixer({
										browsers: ['last 2 versions'],
										cascade: false,
									}),
								],
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isDevelopment,
							},
						},
					],
				}),
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|mp3|ogv|mp4|webm|eot|otf|ttf|woff|woff2)$/,
				include: publicPath,
				use: 'file-loader',
			},
		],
	},

	plugins: [
		new CleanWebpackPlugin([
			'dist',
		]),
		new CopyWebpackPlugin([
			{ from: '../public', to: 'public' },
		]),
		new Webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: './scripts/vendor-[hash].js',
		}),
		new ExtractTextPlugin({
			filename: './styles/[hash].css',
		}),
		new HtmlWebpackPlugin({
			attributes,
			filename: 'index.html',
			template: './index.ejs',
			minify: !isDevelopment ? {
				removeComments: true,
				collapseWhitespace: true,
			} : false,
		}),
	],

	resolve: {
		modules: [
			path.resolve(__dirname, './../dist/'),
			path.resolve(__dirname, './public'),
			path.resolve(__dirname, './node_modules'),
		],
	},

	stats: {
		colors: true,
		children: false,
	},
};

// Service worker
if (!isDevelopment) {
	config.plugins.push(new SWPrecacheWebpackPlugin({
		dontCacheBustUrlsMatching: /\.\w{8}\./,
		filename: 'service-worker.js',
		minify: true,
		navigateFallback: 'index.html',
		staticFileGlobsIgnorePatterns: [/asset-manifest\.json$/],
	}));
}

// Release log
console.log('\x1b[104m\n');
console.log(`  Environment: ${attributes.environment}`);
console.log(`  Version: ${attributes.version}`);
console.log(`  Branch: ${attributes.branch}`);
console.log(`  Revision: ${attributes.revision}`);
console.log(`  Release date: ${attributes.date}`);
console.log(`  Release time: ${attributes.time}`);
console.log('\x1b[0m\n');

module.exports = config;
