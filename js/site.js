var mistakes = require('../');

var m = mistakes(document.getElementById('wrap'));

var prod = location.hostname == 'mistakes.io';

if (prod) {
    m.clientId('5ee342f3754e6324df71');
} else {
    m.clientId('bb7bbe70bd1f707125bc');
}

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

if (location.search.indexOf('?code=') === 0) {
    m.authCode(location.search.replace('?code=', ''), prod ?
        'http://mistakesauth.herokuapp.com' :
        'http://localhostauth.herokuapp.com');
}
