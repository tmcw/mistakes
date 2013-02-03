function stringify(x) {
    if (typeof x == 'function') {
        return '[function]';
    } else {
        try {
            return JSON.stringify(x);
        } catch(e) {
            return '';
        }
    }
}

function runCodes() {
    var v = editor.getValue().split('\n');
    var res = '';
    for (var i = 0; i < v.length; i++) {
        if (v[i]) {
            try {
                if (v[i].match(/^\s*?\/\//)) {
                    res += '\n';
                } else {
                    var output = (function() {
                        return eval(v.slice(0,i+1).join('\n'));
                    })();
                    res += stringify(output) + '\n';
                }
            } catch(e) {
                if (!(e instanceof SyntaxError)) {
                    res += e;
                } else {
                    res += '\n';
                }
            }
        } else {
            res += '\n';
        }
    }
    result.setValue(res);
}

function require(x) {
    var scripts = document.head.getElementsByTagName('script');
    // do not re-add scripts
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src == x) return 'loaded';
    }
    var scr = document.head.appendChild(document.createElement('script'));
    scr.onload = runCodes;
    scr.src = x;
}

var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: 'javascript',
    matchBrackets: true,
    onChange: runCodes,
    tabSize: 2,
    smartIndent: false
});

var result = CodeMirror.fromTextArea(document.getElementById('results'), {
    mode: 'javascript',
    tabSize: 2,
    readOnly: true
});

function xhr(url, callback) {
    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.onload = callback;
    x.send();
}

function gist(id) {
    xhr("https://api.github.com/gists/" + id, function() {
        var r = JSON.parse(this.response);
        for (var k in r.files) {
            return editor.setValue(r.files[k].content);
        }
    });
}

if (window.location.hash) {
    gist(window.location.hash.substring(1));
}
window.onhashchange = function() {
    gist(window.location.hash.substring(1));
};
