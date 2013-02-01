function runCodes() {
    var v = editor.getValue().split('\n');
    var res = '';
    for (var i = 0; i < v.length; i++) {
        if (v[i]) {
            try {
                if (v[i].match(/^\s*?\/\//)) {
                    res += '\n';
                } else {
                    res += JSON.stringify(eval(v.slice(0,i+1).join('\n'))) + '\n';
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
