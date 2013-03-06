## [mistakes.io](http://macwright.org/mistakes/)

live-coding, oriented towards giving presentations about programming and
showing what you mean.

![](http://farm9.staticflickr.com/8050/8440178754_8e7f5906cc_z.jpg)

## Require

[require functionality is powered by live-require](https://github.com/tmcw/live-require)

There is one additional 'feature' of the interface. A magic function called
`require` will include a javascript file by URL, on the page. Here's
[an example](http://macwright.org/mistakes/#5051892).

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
it's just `eval`. See the [incremental eval module, which powers this part of mistakes](https://github.com/tmcw/incremental-eval).
What works in Javascript works in mistakes. Therefore,
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

## Developing Locally

Clone this repo and run `npm install` && `npm start`

## See Also

* [jsconsole](http://jsconsole.com/)
* [lighttable](http://www.lighttable.com/)
* [tributary.io](http://tributary.io/)
* [bl.ocks.org](http://bl.ocks.org/)
