# Egel example

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

	npm install

## Usage

Starts `webpack-dev-server` and watches the directory for changes.

	npm start

Runs `ESLint` with a customized version of `eslint-config-airbnb-base`.

	npm run lint

Builds an unoptimized staging version with source maps.

	npm run staging

Builds an optimized production version without source maps.

	npm run dist

Builds an optimized production version without source maps and deploys to `gh-pages`.

	npm run deploy
