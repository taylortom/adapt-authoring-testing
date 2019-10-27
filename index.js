const glob = require('glob');
const Mocha = require('mocha');
const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));
const { App, Utils } = require('adapt-authoring-core');

const TESTS_GLOB = 'tests/*.spec.js';

function init() {
  console.log(`Running test suite for ${pkg.name}@${pkg.version}\n`);

  const testFiles = getTestFiles();

  if(!testFiles.length) {
    console.log('\nNo tests defined!\n');
    process.exit();
  }
  setGlobalData();

  const mocha = new Mocha();
  mocha.files.push(...testFiles);
  mocha.run(errors => process.exit(errors ? 1 : 0));
}

function getTestFiles() {
  return Object.keys(App.instance.dependencies).reduce((m, d) => {
    const tests = glob.sync(TESTS_GLOB, { cwd: Utils.getModuleDir(d), realpath: true });
    if(!tests.length) {
      console.log(`WARN: '${d}' doesn't define any tests`);
      return m;
    }
    return m.concat(tests);
  }, []);
}

function setGlobalData() {
  global.ADAPT = {
    app: {
      dependencies: [],
      lang: { t: k => k }
    }
  };
}

module.exports = init;
