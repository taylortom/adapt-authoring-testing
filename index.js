const glob = require('glob');
const Mocha = require('mocha');
const path = require('path');
const { App, Utils } = require('adapt-authoring-core');

const pkg = Utils.requirePackage();
const TESTS_GLOB = 'tests/*.spec.js';

async function init() {
  console.log(`Running test suite for ${pkg.name}@${pkg.version}\n`);

  await App.instance.onReady();

  const testFiles = getTestFiles();

  if(!testFiles.length) {
    console.log('No tests defined!');
    process.exit();
  }
  setGlobalData();

  const mocha = new Mocha();
  mocha.files.push(...testFiles);
  mocha.run(errors => process.exit(errors ? 1 : 0));
}
/**
* Lists test specs to be run
*/
function getTestFiles() {
  return getModulesForTesting().reduce((m,d) => {
    const tests = glob.sync(TESTS_GLOB, { cwd: Utils.getModuleDir(d), realpath: true });
    if(!tests.length) return m;
    console.log(`Tests defined for '${d}'`);
    return m.concat(tests);
  }, []);
}
/**
* Returns the list of modules which should be tested
* if --modules= is passed, only specified modules will be tested
*/
function getModulesForTesting() {
  const includedModules = process.env.aat_modules;
  const allDeps = Object.keys(App.instance.dependencies);
  if(!includedModules) {
    return allDeps;
  }
  return includedModules.split(',').reduce((a,m) => {
    const mLong = `adapt-authoring-${m}`;
    if(allDeps.includes(m)) a.push(m);
    else if(allDeps.includes(mLong)) a.push(mLong);
    return a;
  }, []);
}
/**
* Mocks the App instance for use in tests
*/
function setGlobalData() {
  const config = generateConfigData();
  global.ADAPT = {
    app: {
      dependencies: [],
      dependencyloader: { modules: {}, utilities: {} },
      lang: { t: k => k },
      config: { config, get: key => config[key] || key }
    }
  };
}
/**
* Loads the testing config data
*/
function generateConfigData() {
  const configName = `${process.env.NODE_ENV}.config.js`;
  const configPath = path.join(process.cwd(), 'conf', `${process.env.NODE_ENV}.config.js`);
  return Object.entries(require(configPath)).reduce((m,[d,c]) => {
    Object.entries(c).forEach(([k,v]) => m[`${d}.${k}`] = v);
    return m;
  },{});
}

module.exports = init;
