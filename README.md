## [mistakes](http://macwright.org/mistakes/)

live-coding, oriented towards giving presentations about programming and
showing what you mean.

Internally, it's very simple:

1. Split the input by line
2. `eval()` `line -> n` for every line, `JSON.stringify` and display on the right
