## [MISTAKES](http://macwright.org/mistakes/)

live-coding, oriented towards giving presentations about programming and
showing what you mean.

![](http://farm9.staticflickr.com/8050/8440178754_8e7f5906cc_z.jpg)

## Process

1. Split the input by line
2. `eval()` `line -> n` for every line, `JSON.stringify` and display on the right

## Require

There is one additional 'feature' of the interface. A magic function called
`require` will include a javascript file by URL, on the page. Here's
[an example](http://macwright.org/mistakes/#5051892). Require is simple:
here it is:

```js
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
```

## Gists

mistakes supports loading from [GitHub Gists](https://gist.github.com/) to
help you share code better. When you see a URL like http://macwright.org/mistakes/#5051892
that means it's loading the gist at https://gist.github.com/tmcw/5051892.

It works with anyone's gists. The expectation is that gists contain a single
Javascript file - you can add a README too if you give it a file extension
other than `.js`, like if you name it `README.md`.

## Notes

There are a few 'principles' of mistakes:

Mistakes _does not do magic_. There is no complicated code compilation or parsing -
it's just `eval`. What works in Javascript works in mistakes. Therefore,
there's very little code - less than 200 sloc if you don't count [CodeMirror](http://codemirror.net/),
the editor component.

## Local

There are three rules of presenting:

1. **Never ever rely on the internet for a presentation.**
2. Always have a VGA adapter at all times.
3. Only present about things you're interested in.

Mistakes now helps with #1. Instead of counting on [GitHub Gists](https://gist.github.com/)
for samples when giving a live presentation, clone (or download) this repository
and drop Javascript files in the `local/` directory. I've included
`equals.js` in there as an example.

Then [boot up a server](https://gist.github.com/tmcw/4989751), and go to
`http://localhost:3000/#yourfile.js` or whatever.
