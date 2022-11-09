# Running automated tests

> NOTE: The testing suite is currently undergoung maintenance, so cannot be run at present.

Each core module in the Adapt authoring tool comes with a suite of automated tests to verify it functions as designed. We also encourage developers of third-party modules to include tests for their own code.

The Adapt authoring tool comes with a CLI wrapper to make running each module's set of tests easy.

To perform the included tests, simply run the following from a command-line prompt:

```
npx at-test
```

The tool will then run through the full test suite and report on any results.
