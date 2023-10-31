#!/usr/bin/env node
/**
 * Runs the automated testing suite.
 * @param {String} --modules=[modules...] Comma separated list specifying which modules should be tested (all modules are tested by default).
 */
import { App } from 'adapt-authoring-core'
import { globSync } from 'glob'
import Mocha from 'mocha'

const TESTS_GLOB = 'tests/*.spec.js'

process.env.NODE_ENV = process.env.NODE_ENV || 'testing'

async function init () {
  // store global data for use by test suite
  global.ADAPT = { app: await App.instance.onReady() }
  console.log(`Running test suite for ${global.ADAPT.app.name}@${global.ADAPT.app.version}\n`)
  const testFiles = getTestFiles()

  if (!testFiles.length) {
    console.log('No tests defined!')
    process.exit()
  }
  const mocha = new Mocha()
  mocha.files.push(...testFiles)
  try {
    mocha.run(errors => process.exit(errors ? 1 : 0))
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
/**
 * Lists test specs to be run
 */
function getTestFiles () {
  const whitelist = App.instance.args?.modules.split(',') ?? []
  const includedModules = Object.values(App.instance.dependencies)
    .filter(d => !whitelist.length || whitelist.includes(d.name) || whitelist.includes(`adapt-authoring-${d.name}`))

  return includedModules.reduce((modules, mod) => {
    const tests = globSync(TESTS_GLOB, { cwd: mod.rootDir, realpath: true })
    if (!tests.length) return modules
    console.log(`Tests defined for '${mod.name}'`)
    return modules.concat(tests)
  }, [])
}

export default init()
