# See the README for installation instructions.

NODE_PATH ?= ./node_modules
JS_COMPILER = uglifyjs

all: mistakes.js js/bundle.js

js/bundle.js: package.json
	browserify -r restring \
		-r live-require > js/bundle.js

mistakes.js: \
	js/javascript.js \
	js/site.js \

mistakes%js:
	@cat $(filter %.js,$^) > $@.tmp
	$(JS_COMPILER) $@.tmp -c -m -o $@
