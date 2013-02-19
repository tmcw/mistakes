## [MISTAKES](http://macwright.org/mistakes/)

live-coding, oriented towards giving presentations about programming and
showing what you mean.

![](http://farm9.staticflickr.com/8050/8440178754_8e7f5906cc_z.jpg)

Internally, it's very simple:

1. Split the input by line
2. `eval()` `line -> n` for every line, `JSON.stringify` and display on the right

# Local

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
