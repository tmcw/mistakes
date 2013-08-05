var restring = require('restring'),
    jsonify = require('jsonify'),
    http = require('http'),
    incrementalEval = require('incremental-eval'),
    liveRequire = require('live-require'),
    CodeMirror = require('codemirror');

// load JS support for CodeMirror
require('./js/javascript')(CodeMirror);

function xhr(opts, callback) {
    var o = '';
    http.get(opts, function(res) {
        res.on('data', function(buf) { o += buf; })
            .on('end', function(buf) { callback(o); });
    });
}

function mistakes(__div, clientId) {
    var __s = {}, authCode;
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

    function __saveAsGist(editor) {
        var content = editor.getValue(),
            h = new window.XMLHttpRequest();

        document.body.className = 'loading';

        h.onload = function() {
            document.body.className = '';
            var d = (JSON.parse(h.responseText));
            window.location.hash = '#' + d.id;
        };

        h.onerror = function() {
            document.body.className = '';
            document.getElementById('save-button').innerHTML = 'gist could not be saved';
            window.setTimeout(function() {
                document.getElementById('save-button').innerHTML = 's';
            }, 2000);
        };

        if (location.hash && localStorage.github_token) {
            h.open('PATCH', 'https://api.github.com/gists/' + location.hash.replace('#', ''), true);
        } else {
            h.open('POST', 'https://api.github.com/gists', true);
        }
        __setAuthorizationHeader(h);
        h.send(JSON.stringify({
            description: "Gist from mistakes.io",
            public: true,
            files: {
                "index.js": {
                    content: content
                }
            }
        }));
    }

    document.getElementById('save-button').onclick = function() {
        __saveAsGist(__editor);
        return false;
    };

    var __loginButton = document.getElementById('login-button');

    function __setClientId(_) {
        __loginButton.setAttribute('href',
            'https://github.com/login/oauth/authorize?client_id=' + _ + '&scope=gist');
    }

    function __setAuthorizationHeader(h) {
        if (localStorage.github_token) {
            h.setRequestHeader('Authorization', 'token ' + localStorage.github_token);
        }
    }

    function __authHeaders() {
        return localStorage.github_token ? {
            Authorization: 'token ' + localStorage.github_token
        } : {};
    }

    function __setAuthCode(_, gatekeeper) {
        xhr({
            host: gatekeeper,
            path: '/authenticate/' + _,
            port: 80
        }, function(res) {
            try {
                var data = JSON.parse(res);
                localStorage.github_token = data.token;
                __confirmToken(true);
            } catch(e) {
                localStorage.github_token = undefined;
                killToken();
            }
        });
    }

    function killTokenUrl() {
        if (location.href.indexOf('?code') !== -1) location.href = location.href.replace(/\?code=.*$/, '');
    }

    function __confirmToken(first) {
        if (!localStorage.github_token) return;
        xhr({ path: '/user?access_token=' + localStorage.github_token,
            host: 'api.github.com',
            port: 443,
            scheme: 'https'
        }, function(res) {
            try {
                var user = JSON.parse(res);
                if (!user.name) throw new Error('no name');
                __loginButton.innerHTML = 'logout (' + user.login + ')';
                __loginButton.onclick = function() {
                    localStorage.removeItem('github_token');
                    killTokenUrl();
                    return false;
                };
                if (first) killTokenUrl();
            } catch(e) {
                localStorage.removeItem('github_token');
                if (first) killTokenUrl();
            }
        });
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
            document.body.className = 'loading';
            xhr({ path: '/gists/' + id,
                host: 'api.github.com',
                port: 443,
                scheme: 'https'
            }, function(res) {
                document.body.className = '';
                __showGistButton(id);
                var r = jsonify.parse(res);
                for (var k in r.files) {
                    if (isjs(k)) return __content(r.files[k].content);
                }
            });
        }
    }

    function __content(x) {
        if (arguments.length) {
            __editor.setValue(x);
            return __s;
        } else {
            return __editor.getValue();
        }
    }

    var __left = __div.appendChild(document.createElement('div')),
        __right = __div.appendChild(document.createElement('div')),
        __code = __left.appendChild(document.createElement('textarea')),
        __results = __right.appendChild(document.createElement('textarea'));

    __left.className = 'left';
    __right.className = 'right';
    __code.className = 'code';
    __results.className = 'results';

    if (window !== window.top) __showIframeButton();

    CodeMirror.keyMap.tabSpace = {
        Tab: function(cm) {
            var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
            cm.replaceSelection(spaces, 'end', '+input');
        },
        fallthrough: ['default']
    };

    var __editor = CodeMirror.fromTextArea(__code, {
        mode: 'javascript',
        matchBrackets: true,
        tabSize: 2,
        autofocus: (window === window.top),
        extraKeys: {
            'Ctrl-S': __saveAsGist,
            'Cmd-S': __saveAsGist
        },
        keyMap: 'tabSpace',
        smartIndent: true
    });

    __editor.on('change', __runCodes);

    var __result = CodeMirror.fromTextArea(__results, {
        mode: 'javascript',
        tabSize: 2,
        readOnly: true
    });

    __editor.setOption("theme", 'mistakes');
    __result.setOption("theme", 'mistakes');

    __s.gist = __gist;
    __s.content = __content;
    __s.clientId = __setClientId;
    __s.authCode = __setAuthCode;

    __confirmToken();

    return __s;
}

module.exports = mistakes;
