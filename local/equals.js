// the difference between == and ===

// double equals tests loose equality
5 == 5;
// it will convert types silently
'5' == 5;

// triple equals will not
'5' === 5;

// let's think about **objects**

// two objects with the same attributes are neither
// double or triple equal
({ foo: 'bar' } == { foo: 'bar' });
({ foo: 'bar' } === { foo: 'bar' });

// objects are only equal to exactly themselves
var myObject = { foo: 'bar' };
myObject === myObject;

// so in order to test object equality, we can either
// do a 'deepEquals' like underscore:
require('http://underscorejs.org/underscore-min.js');
_.isEqual({ foo: 'bar' }, { foo: 'bar' });

// or we can use a key function that returns something
// we **can** easily test the equality of
function key(obj) {
  return obj.foo;
}

// and then it's easy to compare that value
key({ foo: 'bar' }) === key({ foo: 'bar' });
