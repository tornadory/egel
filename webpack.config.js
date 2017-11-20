// Vendor
const path = require('path');

// Paths
const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

// Environment
const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
	context: srcPath,
	devtool: isDevelopment ? 'eval-cheap-module-source-map' : '',
	entry: './index.js',
	output: {
		path: distPath,
		filename: !isDevelopment ? 'egel.min.js' : 'egel.js',
		library: 'egel',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!(gl-matrix)\/).*/,
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
		],
	},

	resolve: {
		modules: [
			path.resolve(__dirname, './node_modules'),
		],
	},

	stats: {
		colors: true,
		children: false,
	},
};

module.exports = config;
