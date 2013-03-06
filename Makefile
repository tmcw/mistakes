# See the README for installation instructions.

NODE_PATH ?= ./node_modules
JS_COMPILER = uglifyjs

all: js/bundle.min.js

js/bundle.js: package.json
	browserify -r restring \
		-r jsonify \
		-r codemirror \
		-r incremental-eval \
		-r http \
		-r live-require > js/bundle.js

js/bundle.min.js: js/bundle.js
	uglifyjs js/bundle.js -c -m -o js/bundle.min.js
