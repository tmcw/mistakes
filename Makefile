# See the README for installation instructions.

NODE_PATH ?= ./node_modules
JS_COMPILER = uglifyjs

all: js/bundle.min.js

js/bundle.js: js/site.js index.js
	browserify js/site.js > js/bundle.js

js/bundle.min.js: js/bundle.js
	uglifyjs js/bundle.js -c -m > js/bundle.min.js
