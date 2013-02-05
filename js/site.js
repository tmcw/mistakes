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

function mistakes(div) {
    var s = {};

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

    function runCodes() {
        var v = editor.getValue().split('\n');
        var res = '';
        var nScope;
        for (var i = 0; i < v.length; i++) {
            if (v[i]) {
                try {
                    nScope = findNearestScopeStart(v.slice(0, i));
                    if (v[i].match(/^\s*?\/\//)) {
                        res += '\n';
                    } else {
                        res += stringify((function() {
                            return eval(v.slice(nScope ? nScope + 1 : 0, i + 1).join('\n'));
                        })()) + '\n';
                    }
                } catch(e) {
                    if (!(e instanceof SyntaxError)) res += e;
                    else res += '\n';
                }
            } else res += '\n';
            nScope = null;
        }
        result.setValue(res);
    }

    function findNearestScopeStart(lines){
        var i = lines.length;
        var reFunc = /function\s*(?:[_$a-zA-Z][_$a-zA-Z0-9]*)?\s*\([^)]*?\)/;
        var res;
        while(i--){
            res = reFunc.exec(lines[i]);
            if(res){ return i; }
        }
        return null;
    }

    function gist(id) {
        xhr("https://api.github.com/gists/" + id, function() {
            var r = JSON.parse(this.response);
            for (var k in r.files) {
                return content(r.files[k].content);
            }
        });
    }

    function content(x) {
        editor.setValue(x);
        return s;
    }

    var inner = div.innerHTML;
    div.innerHTML = '';
    div.className = div.className + ' sl-wrap';

    var left = div.appendChild(document.createElement('div')),
        right = div.appendChild(document.createElement('right')),
        code = left.appendChild(document.createElement('textarea')),
        results = right.appendChild(document.createElement('pre'));

    code.value = inner;

    left.className = 'sl-left';
    right.className = 'sl-right';
    code.className = 'code';
    results.className = 'results';

    var editor = CodeMirror.fromTextArea(code, {
        mode: 'javascript',
        matchBrackets: true,
        onChange: runCodes,
        tabSize: 2,
        smartIndent: false
    });

    var result = CodeMirror.fromTextArea(results, {
        mode: 'javascript',
        tabSize: 2,
        readOnly: true
    });

    s.gist = gist;
    s.content = content;
    return s;
}
