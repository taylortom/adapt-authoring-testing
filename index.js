const glob = require('glob');
const Mocha = require('mocha');
const path = require('path');
const pkg = require('../package.json');

console.log(`Running test suite for ${pkg.name}@${pkg.version}\n`);

const depDir = path.resolve(path.join(__dirname, '..', 'node_modules'));
const testFiles = getTestFiles();

if(!testFiles.length) {
  console.log('\nNo tests defined!\n');
  process.exit();
}
const mocha = new Mocha();
mocha.files.push(...testFiles);
mocha.run(errors => process.exit(errors ? 1 : 0));

function getTestConfig(d) {
  let dpkg;
  try {
    dpkg = require(path.join(depDir, d, 'package.json'));
  } catch(e) {
    console.log(`ERROR: ${e}`);
    return;
  }
  if(!dpkg.hasOwnProperty('adapt_authoring')) {
    return;
  }
  if(!dpkg.adapt_authoring.hasOwnProperty('testing')) {
    console.log(`WARN: '${d}' doesn't define any tests`);
    return;
  }
  return dpkg.adapt_authoring.testing;
}

function getTestFiles() {
  return [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)].reduce((m, d) => {
    const testConf = getTestConfig(d);
    if(!testConf) {
      return m;
    }
    const tests = glob.sync(testConf.tests, { cwd: path.join(depDir, d), realpath: true });

    if(!tests.length) {
      console.log(`WARN: '${d}' defines tests (${testConf.tests}), but none exist`);
      return m;
    }
    return m.concat(tests);
  }, []);
}
