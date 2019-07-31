function defineProperty(obj) {
  return Object.assign({ enumerable: false, configurable: true }, obj)
}

module.exports = defineProperty
