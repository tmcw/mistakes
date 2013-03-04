require=(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{"restring":[function(require,module,exports){module.exports=require('a4v5Vb');
},{}],"a4v5Vb":[function(require,module,exports){var stringify = (function() {
    var DECIMALS = 4;

    function stringify(x) {
        function maxFixed(x) {
            return x
                .toFixed(DECIMALS)
                .replace(/0*$/, '')
                .replace(/\.$/, '');
        }

        function typeComment(x) {
            if (x === null || x === undefined) return '';
            if (x.constructor.name) {
                return ' // ' + x.constructor.name;
            } else return '';
        }

        switch (typeof x) {
            case 'function':
                return '[function' +
                    // show function names, if available
                    (x.name ? (' ' + x.name) : '') + ']';
            case 'number':
                return maxFixed(x) + typeComment(x);
            default:
                try {
                    return JSON.stringify(x) + typeComment(x);
                } catch(e) { return ''; }
        }
    }

    stringify.decimals = function(_) {
        if (!arguments.length) return DECIMALS;
        DECIMALS = _;
        return this;
    };

    return stringify;
})();

if (typeof module !== 'undefined') module.exports = stringify;

},{}],"live-require":[function(require,module,exports){module.exports=require('cnfBca');
},{}],"cnfBca":[function(require,module,exports){// include a script programmatically, by appending it
// to the head of the page. guards against re-insertion,
// and returns 'loaded' when successful.
function liveRequire(x, callback) {
    var scripts = document.head.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src == x) return 'loaded';
    }
    var scr = document.head.appendChild(document.createElement('script'));
    scr.onload = callback;
    scr.src = x;
}

if (typeof module !== 'undefined') module.exports = liveRequire;

},{}]},{},[]);