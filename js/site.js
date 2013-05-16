var mistakes = require('../');

var m = mistakes(document.getElementById('wrap'));

if (window.location.hash) {
    m.gist(window.location.hash.substring(1));
} else {
    var savedText = window.localStorage.savedText;
    m.content(savedText || '"hello, world"; // edit this to begin');
}

window.setInterval(function() {
    window.localStorage.savedText = m.content();
}, 1000);

window.onhashchange = function() {
    m.gist(window.location.hash.substring(1));
};
