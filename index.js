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
    console.log('No tests defined!');
    process.exit();
  }
  setGlobalData();

  const mocha = new Mocha();
  mocha.files.push(...testFiles);
  mocha.run(errors => process.exit(errors ? 1 : 0));
}

function getTestFiles() {
  return getModulesForTesting().reduce((m,d) => {
    const tests = glob.sync(TESTS_GLOB, { cwd: Utils.getModuleDir(d), realpath: true });
    if(!tests.length) return m;
    console.log(`Tests defined for '${d}'`);
    return m.concat(tests);
  }, []);
}

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

function setGlobalData() {
  const config = generateConfigData();
  global.ADAPT = {
    app: {
      dependencies: [],
      lang: { t: k => k },
      config: { config, get: key => key }
    }
  };
}

function generateConfigData() {
  const configName = `${process.env.NODE_ENV}.config.js`;
  const configPath = path.join(process.cwd(), 'conf', `${process.env.NODE_ENV}.config.js`);
  return Object.entries(require(configPath)).reduce((m,[d,c]) => {
    Object.entries(c).forEach(([k,v]) => m[`${d}.${k}`] = v);
    return m;
  },{});
}

module.exports = init;
