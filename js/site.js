var mistakes = require('../');

var m = mistakes(document.getElementById('wrap'));
if (window.location.hash) {
    m.gist(window.location.hash.substring(1));
} else {
    m.content('"hello, world"; // edit this to begin');
}
window.onhashchange = function() {
    m.gist(window.location.hash.substring(1));
};