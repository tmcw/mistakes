# See the README for installation instructions.

NODE_PATH ?= ./node_modules
JS_BEAUTIFIER = uglifyjs -b -i 2 -nm -ns
JS_COMPILER = uglifyjs
LOCALE ?= en_US

sealion.js: Makefile
	@rm -f $@
	$(JS_COMPILER) js/*.js > sealion.js

clean:
	rm -f iD*.js
