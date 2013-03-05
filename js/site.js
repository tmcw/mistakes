var restring = require('restring'),
    jsonify = require('jsonify'),
    http = require('http'),
    incrementalEval = require('incremental-eval'),
    liveRequire = require('live-require');

function xhr(opts, callback) {
    var o = '';
    http.get(opts, function(res) {
        res.on('data', function(buf) { o += buf; })
            .on('end', function(buf) { callback(o); });
    });
}

function mistakes(__div) {
    var __s = {};
    function __runCodes() {
        var __r = incrementalEval(__editor.getValue(), {
                require: function(x) {
                    return liveRequire(x, __runCodes);
                }
            }),
            __res = '';
        for (var __i = 0; __i < __r.length; __i++) {
            if (__r[__i] !== undefined &&
                !(__r[__i] instanceof SyntaxError)) {
                __res += restring(__r[__i]) + '\n';
            } else {
                __res += '\n';
            }
        }
        __result.setValue(__res);
    }

    function __showGistButton(id) {
        var button = document.getElementById('gist-button');
        button.style.display = 'inline';
        button.href = 'http://gist.github.com/' + id;
    }

    function __showIframeButton(id) {
        var button = document.getElementById('iframe-button');
        button.style.display = 'inline';
        button.href = window.location;
    }

    function __gist(id) {
        // Ignore files that are clearly not javascript files.
        //
        // * Have an extension and it is not .txt or .js
        // * Say 'readme'
        function isjs(x) {
            if (x.match(/readme/gi)) return false;
            var n = x.split('.'),
                ext = n[n.length - 1];
            if (n.length > 1 && ext !== 'js' && ext !== 'txt') return false;
            return true;
        }
        if (id.indexOf('.js') !== -1) {
            xhr({ path: '/local/' + id }, function (res) {
                return __content(res);
            });
        } else {
            xhr({ path: '/gists/' + id,
                host: 'api.github.com',
                port: 443,
                scheme: 'https'
            }, function(res) {
                __showGistButton(id);
                var r = jsonify.parse(res);
                for (var k in r.files) {
                    if (isjs(k)) return __content(r.files[k].content);
                }
            });
        }
    }

    function __content(x) {
        __editor.setValue(x);
        return __s;
    }

    var __inner = __div.innerHTML;
    __div.innerHTML = '';
    __div.className = __div.className + ' sl-wrap';

    var __left = __div.appendChild(document.createElement('div')),
        __right = __div.appendChild(document.createElement('right')),
        __code = __left.appendChild(document.createElement('textarea')),
        __results = __right.appendChild(document.createElement('pre'));

    __code.value = __inner;

    __left.className = 'sl-left';
    __right.className = 'sl-right';
    __code.className = 'code';
    __results.className = 'results';

    if (window !== window.top) __showIframeButton();

    var __editor = CodeMirror.fromTextArea(__code, {
        mode: 'javascript',
        matchBrackets: true,
        onChange: __runCodes,
        tabSize: 2,
        autofocus: (window === window.top),
        smartIndent: true
    });

    var __result = CodeMirror.fromTextArea(__results, {
        mode: 'javascript',
        tabSize: 2,
        readOnly: true
    });

    __s.gist = __gist;
    __s.content = __content;
    return __s;
}
