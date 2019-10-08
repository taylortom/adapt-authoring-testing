# Writing automated tests
All 'core-supported' code is covered by a suite automated tests to ensure modules function as expected, and reduces the likelihood of 'regression' bugs.

We use the [Mocha.js](https://mochajs.org) framework for  defining tests, and the [Should.js](http://shouldjs.github.io/) assertion library to make the tests more 'human-readable'.

## What to cover
Generally speaking, automated tests are split into three camps:
- **Unit tests**: cover very specific 'chunks' of code, often individual functions (or even parts of functions).
- **Integration tests**: a level of complexity up from unit tests, they cover the _interaction_ between the individual 'chunks' of code, and test more complex behaviour than unit tests.
- **System tests**: cover the entire application (and hardware/software combinations - we usually limit this to cross-browser testing). It often makes sense to conduct these manually (i.e. in person), as the distinction between what's working and what isn't is not easily checked by automated tests.

As a general rule, you should at least aim to cover the following:
- All of the requirements you've laid out for the module (i.e. all of the functionality you have designed your module to have).
- Any 'utility' functionality (e.g. helper functions) - may not be directly covered by the above, but is a perfect candidate for automated testing.
- Aim to cover as many edge-cases as you can foresee at the time of writing (adding more any time you see them/have time).
- Add tests to cover any bugs you find _before_ you fix them.

## Enabling tests
Before any tests in your module are included when the authoring tool test suite is run, you must add some extra config to your module's `package.json`:
```javascript
{
  "adapt_authoring": {
    "testing": {
      "tests": "tests/*.spec.js"
    }
  }
}
```
The above assumes that your tests are in a folder named `tests`, and named according to the pattern `*.spec.js` (e.g. `lib.spec.js`).

## Defining tests
The tests themselves are written in JavaScript, and thanks to `Should.js` are easy to read.

_If you're completely new to Mocha, their [documentation](https://mochajs.org/#table-of-contents) has a bunch of quick guides on getting up-to-speed._

Some general tips on writing your own tests:

### Be descriptive with definition names
This helps give others a good idea of what you're covering with your test without the need to read the code. also be aware that these descriptions will be shown in the test output.
Although it's completely up to you as to how you group your tests, a good starting point is to group your tests by file, and then function:
```javascript
describe('MyClass', function() {
  describe('#functionName', function() {
    it('should return a boolean value', function() {
      // test goes here...
    });
  });
});
```

This will give you the following output when the test suite is run:
```
MyClass
    #functionName()
      ✓ should return a boolean value

1 passing (1ms)
```

### Make use of `Should.js` for readable tests
`Should.js` makes it really easy to write expressive, human-readable tests, and generally looks a lot nicer than the standard assertion library (although there's nothing to say you can't use that if you _really_ want).

Here are a few examples (see the [API docs](http://shouldjs.github.io) for the full reference):

```javascript
// value is not undefined
value.should.not.be.undefined();
// value is >= 5
value.should.be.aboveOrEqual(5);
// all values in array are 1
values.should.matchEach(1);
// response content-type is application/json
res.should.be.json();
```
