function stringify(x) {
    if (typeof x == 'function') {
        return '[function]';
    } else {
        try {
            return JSON.stringify(x);
        } catch(e) { return ''; }
    }
}

function xhr(url, callback) {
    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.onload = callback;
    x.send();
}

function mistakes(__div) {
    var __s = {};

    function require(x) {
        var scripts = document.head.getElementsByTagName('script');
        // do not re-add scripts
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src == x) return 'loaded';
        }
        var scr = document.head.appendChild(document.createElement('script'));
        scr.onload = __runCodes;
        scr.src = x;
    }

    function __runCodes() {
        var ____v = __editor.getValue().split('\n');
        var ____res = '';
        for (var ____i = 0; ____i < ____v.length; ____i++) {
            var ____line = ____v[____i];
            if (____line) {
                try {
                    if (____line.match(/^\s*?\/\//)) {
                        ____res += '\n';
                    } else {
                        ____res += stringify((function(____js) {
                            return eval(____js);
                        })(____v.slice(0, ____i + 1).join('\n'))) + '\n';
                    }
                } catch(e) {
                    if (!(e instanceof SyntaxError)) ____res += e;
                    else ____res += '\n';
                }
            } else ____res += '\n';
        }
        __result.setValue(____res);
    }

    function __gist(id) {
        // Ignore files that are clearly not javascript files - they
        // have a file extension and that is not .js. This allows
        // users to add README.md to gists.
        function isjs(x) {
            var n = x.split('.');
            if (n.length > 1 && n[n.length - 1] !== 'js') return false;
            return true;
        }
        if (id.indexOf('.js') !== -1) {
            xhr("local/" + id, function() {
                return __content(this.response);
            });
        } else {
            xhr("https://api.github.com/gists/" + id, function() {
                var r = JSON.parse(this.response);
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

    var __editor = CodeMirror.fromTextArea(__code, {
        mode: 'javascript',
        matchBrackets: true,
        onChange: __runCodes,
        tabSize: 2,
        autofocus: true,
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
