// API
process.chdir(__dirname)

const defineJestConfig = require("../../define_jest_config")
module.exports = defineJestConfig({
  testEnvironment: `node`,
  setupFiles: ["../setup-env.js"],
  setupFilesAfterEnv: ["../setup.js"],
})
