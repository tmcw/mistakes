# See the README for installation instructions.

NODE_PATH ?= ./node_modules
JS_COMPILER = uglifyjs

all: mistakes.js

mistakes.js: \
	js/codemirror.js \
	js/javascript.js \
	js/site.js \

mistakes%js:
	@cat $(filter %.js,$^) > $@.tmp
	$(JS_COMPILER) $@.tmp -c -m -o $@
